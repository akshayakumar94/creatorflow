from datetime import datetime
from .. import db


class SocialAccount(db.Model):
    __tablename__ = "social_accounts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    platform = db.Column(db.String(64), nullable=False)  # instagram / facebook / youtube
    account_id = db.Column(db.String(256))
    account_name = db.Column(db.String(256))
    access_token = db.Column(db.Text)
    refresh_token = db.Column(db.Text)
    token_expires_at = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)
    connected_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint("user_id", "platform", name="uq_user_platform"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "platform": self.platform,
            "account_id": self.account_id,
            "account_name": self.account_name,
            "is_active": self.is_active,
            "connected_at": self.connected_at.isoformat(),
        }
