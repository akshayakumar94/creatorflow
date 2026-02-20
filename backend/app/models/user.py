from datetime import datetime
from .. import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    google_id = db.Column(db.String(128), unique=True, nullable=False)
    name = db.Column(db.String(256), nullable=False)
    email = db.Column(db.String(256), unique=True, nullable=False)
    picture = db.Column(db.String(512))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    firm_profile = db.relationship("FirmProfile", backref="user", uselist=False, cascade="all, delete-orphan")
    content_calendar = db.relationship("ContentCalendar", backref="user", cascade="all, delete-orphan")
    social_accounts = db.relationship("SocialAccount", backref="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "picture": self.picture,
            "created_at": self.created_at.isoformat(),
            "has_profile": self.firm_profile is not None,
        }
