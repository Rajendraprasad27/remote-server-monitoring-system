import sys
import os

# -------------------------------------------------
# Ensure project root is in Python path
# -------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from flask import Flask
from database.db import db
from database.models import Server, Metric, Alert, User, Feedback

# -------------------------------------------------
# Flask app context
# -------------------------------------------------
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///sentinel.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

with app.app_context():
    print("🧹 Cleaning database...")

    # ✅ Ensure tables exist before deleting
    db.create_all()

    # ✅ Delete data safely (order matters)
    Metric.query.delete()
    Alert.query.delete()
    Feedback.query.delete()
    Server.query.delete()
    User.query.delete()

    db.session.commit()

    print("✅ Database cleaned successfully!")
