from datetime import datetime
from .. import db


class FirmProfile(db.Model):
    __tablename__ = "firm_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True, nullable=False)
    business_name = db.Column(db.String(256), nullable=False)
    industry = db.Column(db.String(256))
    target_audience = db.Column(db.Text)
    brand_tone = db.Column(db.String(64))  # professional / fun / educational / bold
    primary_goal = db.Column(db.String(64))  # growth / sales / engagement
    posting_frequency = db.Column(db.String(64))  # daily / 3x/week / weekly
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "business_name": self.business_name,
            "industry": self.industry,
            "target_audience": self.target_audience,
            "brand_tone": self.brand_tone,
            "primary_goal": self.primary_goal,
            "posting_frequency": self.posting_frequency,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
