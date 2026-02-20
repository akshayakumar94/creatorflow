"""
Minimal, fast prompt templates for Creator Flow.
"""


def build_generation_prompt(profile, days: int = 5) -> str:
    platforms = ["Instagram", "Facebook", "YouTube", "Instagram", "Facebook"]
    return f"""Generate a {days}-day social media content plan as a JSON array.

Business: {profile.business_name}
Industry: {profile.industry}
Audience: {profile.target_audience}
Tone: {profile.brand_tone}
Goal: {profile.primary_goal}

Return ONLY a JSON array of {days} objects with these exact keys:
day, platform, content_idea, hook, caption, hashtags, script, cta, seo_title, seo_description, seo_tags

Rules:
- Day 1,4 = Instagram (short caption, 10 hashtags, empty script/seo fields)
- Day 2,5 = Facebook (story caption, 3 hashtags, end with question, empty script/seo fields)
- Day 3 = YouTube (seo_title, seo_tags, write script field, empty hashtags)
- No markdown. No explanation. JSON array only.
"""


def build_improve_prompt(item, profile) -> str:
    return f"""Improve this {item.platform} content for a {getattr(profile, 'brand_tone', 'professional')} brand.

Hook: {item.hook}
Caption: {item.caption}
CTA: {item.cta}

Return ONLY a JSON object with keys: hook, caption, hashtags, cta, script
No explanation. JSON only."""


def build_engaging_prompt(item, profile) -> str:
    return f"""Make this {item.platform} content more viral and engaging.

Hook: {item.hook}
Caption: {item.caption}

Return ONLY a JSON object with keys: hook, caption, hashtags, cta, script
Use power words, curiosity gaps, emotion. JSON only."""


def build_regenerate_prompt(day: int, platform: str, profile) -> str:
    return f"""Create new Day {day} content for {platform}.

Business: {getattr(profile, 'business_name', 'Unknown')}
Tone: {getattr(profile, 'brand_tone', 'professional')}
Goal: {getattr(profile, 'primary_goal', 'growth')}

Return ONLY a JSON object with keys:
content_idea, hook, caption, hashtags, script, cta, seo_title, seo_description, seo_tags
JSON only."""
