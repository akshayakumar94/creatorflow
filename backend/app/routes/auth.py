import requests
from flask import Blueprint, redirect, request, jsonify, current_app
from .. import db
from ..models.user import User
from ..utils.jwt_utils import generate_token, jwt_required

auth_bp = Blueprint("auth", __name__)

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"


@auth_bp.route("/google")
def google_login():
    params = {
        "client_id": current_app.config["GOOGLE_CLIENT_ID"],
        "redirect_uri": current_app.config["GOOGLE_REDIRECT_URI"],
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
    }
    query = "&".join(f"{k}={requests.utils.quote(str(v))}" for k, v in params.items())
    return redirect(f"{GOOGLE_AUTH_URL}?{query}")


@auth_bp.route("/google/callback")
def google_callback():
    code = request.args.get("code")
    if not code:
        return redirect(f"{current_app.config['FRONTEND_URL']}/login?error=auth_failed")

    # Exchange code for token
    token_resp = requests.post(
        GOOGLE_TOKEN_URL,
        data={
            "code": code,
            "client_id": current_app.config["GOOGLE_CLIENT_ID"],
            "client_secret": current_app.config["GOOGLE_CLIENT_SECRET"],
            "redirect_uri": current_app.config["GOOGLE_REDIRECT_URI"],
            "grant_type": "authorization_code",
        },
    )
    if token_resp.status_code != 200:
        return redirect(f"{current_app.config['FRONTEND_URL']}/login?error=token_exchange_failed")

    access_token = token_resp.json().get("access_token")

    # Fetch user info
    userinfo_resp = requests.get(
        GOOGLE_USERINFO_URL,
        headers={"Authorization": f"Bearer {access_token}"},
    )
    if userinfo_resp.status_code != 200:
        return redirect(f"{current_app.config['FRONTEND_URL']}/login?error=userinfo_failed")

    info = userinfo_resp.json()
    google_id = info.get("sub")
    email = info.get("email")
    name = info.get("name")
    picture = info.get("picture")

    # Upsert user
    user = User.query.filter_by(google_id=google_id).first()
    if not user:
        user = User.query.filter_by(email=email).first()
        if user:
            user.google_id = google_id
            user.picture = picture
        else:
            user = User(google_id=google_id, name=name, email=email, picture=picture)
            db.session.add(user)
    db.session.commit()

    jwt_token = generate_token(user.id)
    frontend_url = current_app.config["FRONTEND_URL"]
    return redirect(f"{frontend_url}/auth/callback?token={jwt_token}")


@auth_bp.route("/me")
@jwt_required
def me():
    return jsonify(request.current_user.to_dict())
