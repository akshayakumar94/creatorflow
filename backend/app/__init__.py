from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from .config import Config

db = SQLAlchemy()
migrate = Migrate()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, resources={r"/api/*": {"origins": app.config["FRONTEND_URL"]}},
         supports_credentials=True)

    from .routes.auth import auth_bp
    from .routes.profile import profile_bp
    from .routes.content import content_bp
    from .routes.social import social_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(profile_bp, url_prefix="/api/profile")
    app.register_blueprint(content_bp, url_prefix="/api/content")
    app.register_blueprint(social_bp, url_prefix="/api/social")

    @app.route("/api/health")
    def health():
        return {"status": "ok", "service": "Creator Flow API"}

    return app
