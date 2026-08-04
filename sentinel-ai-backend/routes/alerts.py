from flask import Blueprint, jsonify
from database.models import Alert

alerts_bp = Blueprint("alerts", __name__, url_prefix="/api/alerts")

# =========================================
# GET: Fetch active alerts only
# =========================================
@alerts_bp.route("", methods=["GET"])
def get_alerts():
    alerts = (
        Alert.query
        .filter_by(resolved=False)
        .order_by(Alert.timestamp.desc())
        .all()
    )

    return jsonify([
        {
            "id": a.id,
            "serverId": a.server_id,
            "severity": a.severity,
            "message": a.message,
            "timestamp": a.timestamp
        }
        for a in alerts
    ])
