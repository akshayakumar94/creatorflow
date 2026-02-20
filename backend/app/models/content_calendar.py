from datetime import datetime
from .. import db


class ContentCalendar(db.Model):
    __tablename__ = "content_calendar"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    day = db.Column(db.Integer, nullable=False)  # 1-30
    platform = db.Column(db.String(64))  # instagram / facebook / youtube
    content_idea = db.Column(db.Text)
    hook = db.Column(db.Text)
    caption = db.Column(db.Text)
    hashtags = db.Column(db.Text)
    script = db.Column(db.Text)
    cta = db.Column(db.Text)
    seo_title = db.Column(db.String(512))
    seo_description = db.Column(db.Text)
    seo_tags = db.Column(db.Text)
    is_published = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "day": self.day,
            "platform": self.platform,
            "content_idea": self.content_idea,
            "hook": self.hook,
            "caption": self.caption,
            "hashtags": self.hashtags,
            "script": self.script,
            "cta": self.cta,
            "seo_title": self.seo_title,
            "seo_description": self.seo_description,
            "seo_tags": self.seo_tags,
            "is_published": self.is_published,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
