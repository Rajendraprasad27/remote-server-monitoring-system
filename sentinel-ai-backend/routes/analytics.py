from flask import Blueprint, request, jsonify
from services.gemini_service import generate_health_summary

analytics_bp = Blueprint("analytics", __name__, url_prefix="/api/analytics")

@analytics_bp.route("/summary", methods=["POST"])
def analytics_summary():
    data = request.json or {}
    
    # For now, return mock AI summary
    summary = generate_health_summary(
        servers=data.get("servers", []),
        metrics=data.get("metrics", [])
    )

    return jsonify({
        "summary": summary
    })
