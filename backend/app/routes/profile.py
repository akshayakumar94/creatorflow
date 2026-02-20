from flask import Blueprint, request, jsonify
from .. import db
from ..models.firm_profile import FirmProfile
from ..utils.jwt_utils import jwt_required

profile_bp = Blueprint("profile", __name__)

VALID_TONES = {"professional", "fun", "educational", "bold"}
VALID_GOALS = {"growth", "sales", "engagement"}
VALID_FREQUENCIES = {"daily", "3x/week", "weekly"}


@profile_bp.route("", methods=["GET"])
@jwt_required
def get_profile():
    profile = FirmProfile.query.filter_by(user_id=request.current_user.id).first()
    if not profile:
        return jsonify({"profile": None}), 200
    return jsonify({"profile": profile.to_dict()}), 200


@profile_bp.route("", methods=["POST"])
@jwt_required
def upsert_profile():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    required = ["business_name", "industry", "target_audience", "brand_tone", "primary_goal", "posting_frequency"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"Missing field: {field}"}), 400

    if data["brand_tone"] not in VALID_TONES:
        return jsonify({"error": f"brand_tone must be one of {VALID_TONES}"}), 400
    if data["primary_goal"] not in VALID_GOALS:
        return jsonify({"error": f"primary_goal must be one of {VALID_GOALS}"}), 400

    profile = FirmProfile.query.filter_by(user_id=request.current_user.id).first()
    if profile:
        profile.business_name = data["business_name"]
        profile.industry = data["industry"]
        profile.target_audience = data["target_audience"]
        profile.brand_tone = data["brand_tone"]
        profile.primary_goal = data["primary_goal"]
        profile.posting_frequency = data["posting_frequency"]
    else:
        profile = FirmProfile(
            user_id=request.current_user.id,
            business_name=data["business_name"],
            industry=data["industry"],
            target_audience=data["target_audience"],
            brand_tone=data["brand_tone"],
            primary_goal=data["primary_goal"],
            posting_frequency=data["posting_frequency"],
        )
        db.session.add(profile)

    db.session.commit()
    return jsonify({"profile": profile.to_dict()}), 200
