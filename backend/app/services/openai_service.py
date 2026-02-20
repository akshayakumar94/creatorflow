import json
import re
import google.generativeai as genai
from flask import current_app
from .prompt_templates import (
    build_generation_prompt,
    build_improve_prompt,
    build_engaging_prompt,
    build_regenerate_prompt,
)


def _get_model():
    genai.configure(api_key=current_app.config["GEMINI_API_KEY"])
    return genai.GenerativeModel(current_app.config["GEMINI_MODEL"])


def _parse_json_response(text: str):
    """Strip markdown fences and parse JSON from Gemini response."""
    cleaned = re.sub(r"```(?:json)?\s*", "", text).strip().rstrip("`").strip()
    return json.loads(cleaned)


def _generate(system: str, user: str) -> str:
    """Unified Gemini content generation call."""
    model = _get_model()
    full_prompt = f"{system}\n\n{user}"
    response = model.generate_content(full_prompt)
    return response.text


def generate_5_day_plan(profile) -> list:
    prompt = build_generation_prompt(profile, days=5)
    system = (
        "You are a world-class social media content strategist. "
        "Always respond with valid JSON exactly as instructed. "
        "Return ONLY a JSON array of exactly 5 objects, no markdown fences, no extra text."
    )
    raw = _generate(system, prompt)
    days = _parse_json_response(raw)
    if not isinstance(days, list):
        raise ValueError("Expected a JSON array from Gemini")
    if len(days) < 5:
        raise ValueError(f"Expected 5 days, got {len(days)}")
    return days


def improve_content(item, profile) -> dict:
    prompt = build_improve_prompt(item, profile)
    system = "You are an expert social media content strategist. Always respond with valid JSON only."
    raw = _generate(system, prompt)
    return _parse_json_response(raw)


def make_more_engaging(item, profile) -> dict:
    prompt = build_engaging_prompt(item, profile)
    system = "You are a viral content expert. Always respond with valid JSON only."
    raw = _generate(system, prompt)
    return _parse_json_response(raw)


def regenerate_single_day(day: int, platform: str, profile) -> dict:
    prompt = build_regenerate_prompt(day, platform, profile)
    system = "You are an expert social media content strategist. Always respond with valid JSON only."
    raw = _generate(system, prompt)
    return _parse_json_response(raw)
