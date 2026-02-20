import requests
from flask import Blueprint, request, jsonify, redirect, current_app
from .. import db
from ..models.social_account import SocialAccount
from ..utils.jwt_utils import jwt_required

social_bp = Blueprint("social", __name__)

META_OAUTH_URL = "https://www.facebook.com/v18.0/dialog/oauth"
META_TOKEN_URL = "https://graph.facebook.com/v18.0/oauth/access_token"
META_ME_URL = "https://graph.facebook.com/v18.0/me"

GOOGLE_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
YOUTUBE_CHANNEL_URL = "https://www.googleapis.com/youtube/v3/channels"
YOUTUBE_SCOPES = "https://www.googleapis.com/auth/youtube.readonly"


@social_bp.route("/accounts", methods=["GET"])
@jwt_required
def get_accounts():
    accounts = SocialAccount.query.filter_by(user_id=request.current_user.id, is_active=True).all()
    return jsonify({"accounts": [a.to_dict() for a in accounts]}), 200


@social_bp.route("/connect/instagram", methods=["GET"])
@jwt_required
def connect_instagram():
    params = {
        "client_id": current_app.config["META_APP_ID"],
        "redirect_uri": current_app.config["META_REDIRECT_URI"],
        "scope": "instagram_basic,instagram_content_publish,pages_show_list",
        "response_type": "code",
        "state": f"instagram:{request.current_user.id}",
    }
    query = "&".join(f"{k}={requests.utils.quote(str(v))}" for k, v in params.items())
    return jsonify({"oauth_url": f"{META_OAUTH_URL}?{query}"}), 200


@social_bp.route("/connect/facebook", methods=["GET"])
@jwt_required
def connect_facebook():
    params = {
        "client_id": current_app.config["META_APP_ID"],
        "redirect_uri": current_app.config["META_REDIRECT_URI"],
        "scope": "pages_manage_posts,pages_read_engagement,publish_to_groups",
        "response_type": "code",
        "state": f"facebook:{request.current_user.id}",
    }
    query = "&".join(f"{k}={requests.utils.quote(str(v))}" for k, v in params.items())
    return jsonify({"oauth_url": f"{META_OAUTH_URL}?{query}"}), 200


@social_bp.route("/connect/youtube", methods=["GET"])
@jwt_required
def connect_youtube():
    params = {
        "client_id": current_app.config["YOUTUBE_CLIENT_ID"],
        "redirect_uri": current_app.config["YOUTUBE_REDIRECT_URI"],
        "response_type": "code",
        "scope": YOUTUBE_SCOPES,
        "access_type": "offline",
        "state": f"youtube:{request.current_user.id}",
    }
    query = "&".join(f"{k}={requests.utils.quote(str(v))}" for k, v in params.items())
    return jsonify({"oauth_url": f"{GOOGLE_OAUTH_URL}?{query}"}), 200


@social_bp.route("/callback/meta", methods=["GET"])
def meta_callback():
    code = request.args.get("code")
    state = request.args.get("state", "")
    platform, user_id_str = state.split(":", 1) if ":" in state else ("", "")
    user_id = int(user_id_str) if user_id_str.isdigit() else None

    if not code or not user_id:
        return redirect(f"{current_app.config['FRONTEND_URL']}/accounts?error=oauth_failed")

    token_resp = requests.get(META_TOKEN_URL, params={
        "client_id": current_app.config["META_APP_ID"],
        "client_secret": current_app.config["META_APP_SECRET"],
        "redirect_uri": current_app.config["META_REDIRECT_URI"],
        "code": code,
    })
    if token_resp.status_code != 200:
        return redirect(f"{current_app.config['FRONTEND_URL']}/accounts?error=token_failed")

    access_token = token_resp.json().get("access_token")
    me_resp = requests.get(META_ME_URL, params={"access_token": access_token, "fields": "id,name"})
    me_data = me_resp.json()

    account = SocialAccount.query.filter_by(user_id=user_id, platform=platform).first()
    if account:
        account.access_token = access_token
        account.account_id = me_data.get("id")
        account.account_name = me_data.get("name")
        account.is_active = True
    else:
        account = SocialAccount(
            user_id=user_id,
            platform=platform,
            access_token=access_token,
            account_id=me_data.get("id"),
            account_name=me_data.get("name"),
        )
        db.session.add(account)
    db.session.commit()

    return redirect(f"{current_app.config['FRONTEND_URL']}/accounts?success={platform}")


@social_bp.route("/callback/youtube", methods=["GET"])
def youtube_callback():
    code = request.args.get("code")
    state = request.args.get("state", "")
    _, user_id_str = state.split(":", 1) if ":" in state else ("", "")
    user_id = int(user_id_str) if user_id_str.isdigit() else None

    if not code or not user_id:
        return redirect(f"{current_app.config['FRONTEND_URL']}/accounts?error=oauth_failed")

    token_resp = requests.post(GOOGLE_TOKEN_URL, data={
        "code": code,
        "client_id": current_app.config["YOUTUBE_CLIENT_ID"],
        "client_secret": current_app.config["YOUTUBE_CLIENT_SECRET"],
        "redirect_uri": current_app.config["YOUTUBE_REDIRECT_URI"],
        "grant_type": "authorization_code",
    })
    tokens = token_resp.json()
    access_token = tokens.get("access_token")
    refresh_token = tokens.get("refresh_token")

    channel_resp = requests.get(
        YOUTUBE_CHANNEL_URL,
        params={"part": "snippet", "mine": "true"},
        headers={"Authorization": f"Bearer {access_token}"},
    )
    channel_data = channel_resp.json()
    channel = channel_data.get("items", [{}])[0]
    channel_id = channel.get("id", "")
    channel_title = channel.get("snippet", {}).get("title", "YouTube Channel")

    account = SocialAccount.query.filter_by(user_id=user_id, platform="youtube").first()
    if account:
        account.access_token = access_token
        account.refresh_token = refresh_token
        account.account_id = channel_id
        account.account_name = channel_title
        account.is_active = True
    else:
        account = SocialAccount(
            user_id=user_id,
            platform="youtube",
            access_token=access_token,
            refresh_token=refresh_token,
            account_id=channel_id,
            account_name=channel_title,
        )
        db.session.add(account)
    db.session.commit()

    return redirect(f"{current_app.config['FRONTEND_URL']}/accounts?success=youtube")


@social_bp.route("/disconnect/<int:account_id>", methods=["DELETE"])
@jwt_required
def disconnect(account_id):
    account = SocialAccount.query.filter_by(id=account_id, user_id=request.current_user.id).first()
    if not account:
        return jsonify({"error": "Account not found"}), 404
    account.is_active = False
    db.session.commit()
    return jsonify({"message": "Account disconnected"}), 200
