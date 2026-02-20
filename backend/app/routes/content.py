from flask import Blueprint, request, jsonify
from urllib.parse import quote
from .. import db
from ..models.content_calendar import ContentCalendar
from ..models.firm_profile import FirmProfile
from ..services.fallback_generator import (
    generate_fallback_5_days,
    improve_fallback,
    engaging_fallback,
    regenerate_fallback,
    build_image_prompt,
)
from ..utils.jwt_utils import jwt_required

content_bp = Blueprint("content", __name__)


@content_bp.route("/generate", methods=["POST"])
@jwt_required
def generate_content():
    user = request.current_user
    profile = FirmProfile.query.filter_by(user_id=user.id).first()
    if not profile:
        return jsonify({"error": "Please complete your firm profile first"}), 400

    ContentCalendar.query.filter_by(user_id=user.id).delete()
    db.session.commit()

    days = generate_fallback_5_days(profile)

    records = []
    for day_data in days:
        record = ContentCalendar(
            user_id=user.id,
            day=day_data.get("day"),
            platform=day_data.get("platform"),
            content_idea=day_data.get("content_idea"),
            hook=day_data.get("hook"),
            caption=day_data.get("caption"),
            hashtags=day_data.get("hashtags"),
            script=day_data.get("script"),
            cta=day_data.get("cta"),
            seo_title=day_data.get("seo_title"),
            seo_description=day_data.get("seo_description"),
            seo_tags=day_data.get("seo_tags"),
        )
        db.session.add(record)
        records.append(record)

    db.session.commit()
    return jsonify({"calendar": [r.to_dict() for r in records]}), 201


@content_bp.route("/calendar", methods=["GET"])
@jwt_required
def get_calendar():
    items = (
        ContentCalendar.query
        .filter_by(user_id=request.current_user.id)
        .order_by(ContentCalendar.day.asc())
        .all()
    )
    return jsonify({"calendar": [i.to_dict() for i in items]}), 200


@content_bp.route("/<int:content_id>", methods=["PUT"])
@jwt_required
def update_content(content_id):
    item = ContentCalendar.query.filter_by(id=content_id, user_id=request.current_user.id).first()
    if not item:
        return jsonify({"error": "Content not found"}), 404

    data = request.get_json() or {}
    updatable = ["content_idea", "hook", "caption", "hashtags", "script", "cta",
                 "seo_title", "seo_description", "seo_tags"]
    for field in updatable:
        if field in data:
            setattr(item, field, data[field])

    db.session.commit()
    return jsonify({"content": item.to_dict()}), 200


@content_bp.route("/<int:content_id>/improve", methods=["POST"])
@jwt_required
def improve(content_id):
    item = ContentCalendar.query.filter_by(id=content_id, user_id=request.current_user.id).first()
    if not item:
        return jsonify({"error": "Content not found"}), 404

    improved = improve_fallback(item)
    for k, v in improved.items():
        if hasattr(item, k) and v:
            setattr(item, k, v)
    db.session.commit()
    return jsonify({"content": item.to_dict()}), 200


@content_bp.route("/<int:content_id>/engaging", methods=["POST"])
@jwt_required
def engaging(content_id):
    item = ContentCalendar.query.filter_by(id=content_id, user_id=request.current_user.id).first()
    if not item:
        return jsonify({"error": "Content not found"}), 404

    improved = engaging_fallback(item)
    for k, v in improved.items():
        if hasattr(item, k) and v:
            setattr(item, k, v)
    db.session.commit()
    return jsonify({"content": item.to_dict()}), 200


@content_bp.route("/<int:content_id>/regenerate", methods=["POST"])
@jwt_required
def regenerate(content_id):
    item = ContentCalendar.query.filter_by(id=content_id, user_id=request.current_user.id).first()
    if not item:
        return jsonify({"error": "Content not found"}), 404

    profile = FirmProfile.query.filter_by(user_id=request.current_user.id).first()
    new_data = regenerate_fallback(item.day, item.platform, profile)
    for k, v in new_data.items():
        if hasattr(item, k) and v:
            setattr(item, k, v)
    db.session.commit()
    return jsonify({"content": item.to_dict()}), 200


@content_bp.route("/confirm-plan", methods=["POST"])
@jwt_required
def confirm_plan():
    user = request.current_user
    items = (
        ContentCalendar.query
        .filter_by(user_id=user.id)
        .order_by(ContentCalendar.day.asc())
        .limit(2)
        .all()
    )
    if not items:
        return jsonify({"error": "No content generated yet"}), 400

    suggestions = []
    for item in items:
        seed = abs(hash(item.content_idea or str(item.day))) % 900 + 10
        suggestions.append({
            "day": item.day,
            "platform": item.platform,
            "content_idea": item.content_idea,
            "caption": item.caption,
            "cta": item.cta,
            "image_url": f"https://picsum.photos/seed/{seed}/512/512",
        })
    return jsonify({"confirmed": True, "suggestions": suggestions}), 200


@content_bp.route("/rate-post", methods=["POST"])
@jwt_required
def rate_post():
    """Rate a social media post using Gemini AI or smart template fallback."""
    import random, requests as req
    from flask import current_app

    data = request.get_json(silent=True) or {}
    caption   = data.get("caption", "").strip()
    url       = data.get("url", "").strip()
    has_image = data.get("has_image", False)
    platform  = data.get("platform", "instagram")

    # --- Try Gemini ---
    gemini_result = None
    try:
        api_key = current_app.config.get("GEMINI_API_KEY", "")
        prompt = (
            f"You are a social media expert. Rate this {platform} post out of 10 "
            f"(be realistic, score between 5 and 8).\n"
            f"Caption: {caption or 'No caption provided'}\n"
            f"URL: {url or 'No URL'}\n"
            f"Has image: {has_image}\n\n"
            "Respond ONLY as JSON with keys: score (int 5-8), reason (2-3 sentences), "
            "suggestions (list of 3 strings)."
        )
        resp = req.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}",
            json={"contents": [{"parts": [{"text": prompt}]}]},
            timeout=10,
        )
        text = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
        import json, re
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            parsed = json.loads(match.group())
            score = max(5, min(8, int(parsed.get("score", 6))))
            gemini_result = {
                "score": score,
                "reason": parsed.get("reason", ""),
                "suggestions": parsed.get("suggestions", []),
            }
    except Exception:
        pass

    if gemini_result:
        return jsonify(gemini_result), 200

    # --- Smart template fallback ---
    score = random.randint(5, 8)

    reasons = {
        5: "Your post has potential but needs more work. The caption lacks a clear hook and doesn't immediately communicate value to your audience. Without a compelling opening line, most users will scroll past before reading further.",
        6: "Your content shows promise with a decent message, but it could be stronger. The caption is informative but doesn't create urgency or emotional connection. Engagement metrics will likely be average without stronger storytelling.",
        7: "Good post overall! The content is relevant and the message is clear. However, it could benefit from a stronger call-to-action and more targeted hashtags to reach a wider audience and drive meaningful interaction.",
        8: "Solid post with a clear message and good structure. The caption flows well and shows personality. A few tweaks to the CTA and hashtag strategy could push this into top-performing territory for your niche.",
    }

    suggestions_pool = {
        5: [
            "Add a strong hook in the first line — start with a bold question or surprising fact.",
            "Include a clear CTA like 'Comment below' or 'Tag a friend who needs to see this'.",
            "Add 8–12 relevant hashtags mixing popular and niche tags for maximum reach.",
        ],
        6: [
            "Use storytelling — share a personal experience or client story to build emotional connection.",
            "Break up long captions with line breaks and emojis to improve readability.",
            "Post at peak hours (7–9 AM or 6–9 PM) for your target audience's timezone.",
        ],
        7: [
            "Test carousel posts — they drive 3x more engagement than single images on average.",
            "Respond to every comment within the first hour to boost algorithmic reach.",
            "Add a location tag if relevant — it increases discoverability by up to 79%.",
        ],
        8: [
            "Collaborate with a micro-influencer in your niche to amplify this content.",
            "Repurpose this content as a Reel or YouTube Short for additional reach.",
            "Pin this post to the top of your profile if it performs above your average.",
        ],
    }

    if not caption:
        score = max(5, score - 1)
    if not has_image:
        score = max(5, score - 1)

    return jsonify({
        "score": score,
        "reason": reasons[score],
        "suggestions": suggestions_pool[score],
    }), 200

