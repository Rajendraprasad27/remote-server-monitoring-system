from flask import Blueprint, request, jsonify
from database.models import Feedback
from database.db import db

feedback_bp = Blueprint("feedback", __name__, url_prefix="/api/feedback")

@feedback_bp.route("", methods=["POST"])
def submit_feedback():
    data = request.json
    fb = Feedback(**data)
    db.session.add(fb)
    db.session.commit()
    return jsonify({"message": "Feedback submitted"})
