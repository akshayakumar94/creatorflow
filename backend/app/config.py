import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key-change-in-production")
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", "postgresql://postgres:password@localhost:5432/creator_flow"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-secret-change-in-production")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)

    # Google OAuth
    GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "")
    GOOGLE_REDIRECT_URI = os.environ.get(
        "GOOGLE_REDIRECT_URI", "http://localhost:5000/api/auth/google/callback"
    )

    # Gemini
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
    GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.0-flash")

    # Meta (Facebook / Instagram)
    META_APP_ID = os.environ.get("META_APP_ID", "")
    META_APP_SECRET = os.environ.get("META_APP_SECRET", "")
    META_REDIRECT_URI = os.environ.get(
        "META_REDIRECT_URI", "http://localhost:5000/api/social/callback/meta"
    )

    # YouTube
    YOUTUBE_CLIENT_ID = os.environ.get("YOUTUBE_CLIENT_ID", "")
    YOUTUBE_CLIENT_SECRET = os.environ.get("YOUTUBE_CLIENT_SECRET", "")
    YOUTUBE_REDIRECT_URI = os.environ.get(
        "YOUTUBE_REDIRECT_URI", "http://localhost:5000/api/social/callback/youtube"
    )

    # Frontend
    FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")
