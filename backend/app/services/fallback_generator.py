"""
Template-based fallback content generator.
Used when AI API is unavailable or over quota.
Generates realistic sample content from the firm profile.
"""

import random

INSTAGRAM_IDEAS = [
    "Behind-the-scenes look at our process",
    "Client success story spotlight",
    "Top 3 tips for your industry",
    "Product/service feature highlight",
    "Team introduction post",
]
FACEBOOK_IDEAS = [
    "Industry insight and community discussion",
    "Customer testimonial story",
    "How-to guide for your audience",
    "Company milestone celebration",
    "Q&A session invitation",
]
YOUTUBE_IDEAS = [
    "Full tutorial: Getting started guide",
    "Expert interview: Industry insights",
    "Case study walkthrough",
    "Product demo and review",
    "Top 5 mistakes to avoid",
]
CTAS = [
    "Follow us for more!", "Save this post!", "Share with someone who needs this!",
    "Comment your thoughts below!", "Link in bio to learn more!",
    "Subscribe for weekly tips!", "Tag a friend!",
]


def _instagram_day(day: int, profile) -> dict:
    idea = INSTAGRAM_IDEAS[day % len(INSTAGRAM_IDEAS)]
    return {
        "day": day,
        "platform": "instagram",
        "content_idea": f"{idea} — {profile.business_name}",
        "hook": f"🚀 Did you know that {profile.industry} businesses are changing fast?",
        "caption": (
            f"At {profile.business_name}, we're passionate about helping {profile.target_audience}.\n\n"
            f"Our {profile.brand_tone} approach means you always get results focused on {profile.primary_goal}.\n\n"
            f"Here's what we've been working on: {idea.lower()}. "
            f"We believe in transparency and sharing the journey with you.\n\n"
            f"What's one thing you'd like to see us post about? Drop it in the comments! 👇"
        ),
        "hashtags": (
            f"#{profile.industry.replace(' ', '')} #{profile.business_name.replace(' ', '')} "
            f"#ContentCreator #SmallBusiness #GrowthMindset "
            f"#Marketing #BusinessTips #Entrepreneur #Success #Instagram"
        ),
        "script": "",
        "cta": random.choice(CTAS),
        "seo_title": "",
        "seo_description": "",
        "seo_tags": "",
    }


def _facebook_day(day: int, profile) -> dict:
    idea = FACEBOOK_IDEAS[day % len(FACEBOOK_IDEAS)]
    return {
        "day": day,
        "platform": "facebook",
        "content_idea": f"{idea} — {profile.business_name}",
        "hook": f"We want to hear from you, {profile.target_audience}!",
        "caption": (
            f"Hello from {profile.business_name}! 👋\n\n"
            f"Today we're talking about: {idea}.\n\n"
            f"In the {profile.industry} space, we know that {profile.target_audience} "
            f"face real challenges every day. That's why our goal is {profile.primary_goal} "
            f"for every single client we work with.\n\n"
            f"We take a {profile.brand_tone} approach to everything we do, and it's making a real difference.\n\n"
            f"👉 What's the biggest challenge you're facing right now in {profile.industry}? "
            f"Let us know in the comments — we read every single one!"
        ),
        "hashtags": f"#{profile.industry.replace(' ', '')} #{profile.business_name.replace(' ', '')} #Community",
        "script": "",
        "cta": "Tell us in the comments!",
        "seo_title": "",
        "seo_description": "",
        "seo_tags": "",
    }


def _youtube_day(day: int, profile) -> dict:
    idea = YOUTUBE_IDEAS[day % len(YOUTUBE_IDEAS)]
    title = f"{idea} | {profile.business_name}"
    return {
        "day": day,
        "platform": "youtube",
        "content_idea": f"{idea} — {profile.business_name}",
        "hook": f"In the next few minutes, you'll learn exactly how to {idea.lower()}.",
        "caption": f"Watch our latest video: {title}",
        "hashtags": "",
        "script": (
            f"[INTRO]\nHey everyone, welcome back to the {profile.business_name} channel! "
            f"I'm so glad you're here today.\n\n"
            f"[HOOK]\nToday's video is all about: {idea}. "
            f"If you're in {profile.industry} and targeting {profile.target_audience}, "
            f"this is going to be super valuable for you.\n\n"
            f"[MAIN CONTENT]\n"
            f"Point 1: Understanding the basics of {idea.lower()}\n"
            f"Point 2: How {profile.business_name} approaches this for {profile.primary_goal}\n"
            f"Point 3: Our {profile.brand_tone} strategy that works\n\n"
            f"[OUTRO]\nIf you found this helpful, please hit LIKE and SUBSCRIBE "
            f"for weekly content like this. See you in the next video!"
        ),
        "cta": "Like, Subscribe, and hit the notification bell! 🔔",
        "seo_title": title[:70],
        "seo_description": (
            f"{idea} — In this video, {profile.business_name} shares expert insights "
            f"for {profile.target_audience} in the {profile.industry} industry. "
            f"Our goal is your {profile.primary_goal}. "
            f"Subscribe for weekly tips and strategies!"
        ),
        "seo_tags": (
            f"{profile.industry}, {profile.business_name}, {idea.split(':')[0].strip()}, "
            f"tutorial, tips, {profile.target_audience}, {profile.primary_goal}, "
            f"how to, guide, strategy"
        ),
    }


PLATFORM_FUNCS = [_instagram_day, _facebook_day, _youtube_day, _instagram_day, _facebook_day]


def generate_fallback_5_days(profile) -> list:
    return [PLATFORM_FUNCS[i](i + 1, profile) for i in range(5)]


def improve_fallback(item) -> dict:
    """Return a polished version of existing content without API call."""
    hook = item.hook or ""
    caption = item.caption or ""
    return {
        "hook": f"✨ {hook}" if hook and not hook.startswith("✨") else hook,
        "caption": caption + "\n\n💡 Pro tip: Consistency is key to growth. Keep showing up!",
        "hashtags": (item.hashtags or "") + " #Growth #ContentStrategy",
        "cta": "Save this post and share it with someone who needs to see it! 🔖",
        "script": item.script or "",
    }


def engaging_fallback(item) -> dict:
    """Return a more viral/engaging version without API call."""
    hook = item.hook or ""
    caption = item.caption or ""
    power_words = ["🔥 STOP scrolling!", "⚡ This changed everything!", "🚀 Nobody talks about this but..."]
    import random
    new_hook = random.choice(power_words) + " " + hook
    return {
        "hook": new_hook,
        "caption": f"🎯 {caption}\n\n👇 Double tap if this resonates with you!",
        "hashtags": (item.hashtags or "") + " #Viral #MustSee #Trending",
        "cta": "TAG someone who needs to see this RIGHT NOW! 👇",
        "script": item.script or "",
    }


def regenerate_fallback(day: int, platform: str, profile) -> dict:
    """Generate fresh template content for a specific day/platform."""
    funcs = {"instagram": _instagram_day, "facebook": _facebook_day, "youtube": _youtube_day}
    fn = funcs.get(platform, _instagram_day)
    result = fn(day, profile)
    # Remove platform/day keys since route sets them separately
    result.pop("day", None)
    result.pop("platform", None)
    return result


def build_image_prompt(item, profile) -> str:
    """Build a detailed Stable Diffusion / Pollinations.ai prompt for realistic images."""
    industry = getattr(profile, 'industry', 'business').lower()
    idea = (item.content_idea or "").replace(",", "").replace("'", "")[:80]
    tone = getattr(profile, 'brand_tone', 'professional').lower()

    # Tone to visual style mapping
    tone_styles = {
        "professional": "clean corporate photography, soft studio lighting, muted tones",
        "fun": "vibrant colorful lifestyle photography, golden hour light, playful energy",
        "educational": "flat lay desk setup, natural daylight, organized workspace",
        "bold": "dramatic cinematic lighting, high contrast, strong composition",
    }
    visual_style = tone_styles.get(tone, "professional commercial photography")

    # Industry to scene mapping
    industry_scenes = {
        "cafe": "cozy cafe interior, latte art, wooden tables, warm ambient light",
        "restaurant": "beautifully plated gourmet food, restaurant ambiance, bokeh background",
        "fitness": "modern gym, athlete in action, motivational energy, dramatic lighting",
        "fashion": "high-fashion editorial shoot, model, studio backdrop, elegant styling",
        "tech": "sleek technology product on minimal desk, dark mode aesthetic",
        "beauty": "skincare products arranged aesthetically, pastel background, macro lens",
        "real estate": "luxury interior design, wide angle, natural light, modern furniture",
        "education": "open books, laptop, study space, natural window light",
        "healthcare": "clean medical clinic environment, professional, trustworthy",
        "finance": "professional office, suited person, glass building, city backdrop",
    }

    # Find matching industry scene
    scene = next(
        (v for k, v in industry_scenes.items() if k in industry),
        f"{industry} business environment, professional setting"
    )

    # Platform-specific framing
    platform_framing = {
        "instagram": "square composition 1:1, Instagram-worthy aesthetic, lifestyle photography",
        "facebook": "16:9 landscape format, warm community feel, engaging visual story",
        "youtube": "16:9 YouTube thumbnail composition, bold and eye-catching, rule of thirds",
    }
    framing = platform_framing.get(item.platform, "social media optimized composition")

    prompt = (
        f"{idea}, {scene}, {visual_style}, {framing}, "
        f"photorealistic, 8K ultra-detailed, shallow depth of field, "
        f"professional commercial photography, no text, no watermark, no logo"
    )
    return prompt

