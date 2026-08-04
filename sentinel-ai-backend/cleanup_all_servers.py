from app import app
from database.db import db
from database.models import Server, Metric, Alert

with app.app_context():
    print("🧹 Cleaning database...")

    Alert.query.delete()
    Metric.query.delete()
    Server.query.delete()

    db.session.commit()

    print("✅ Database reset complete.")
