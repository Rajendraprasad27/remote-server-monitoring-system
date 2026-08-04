from flask import Blueprint, jsonify
from database.models import Metric
import numpy as np
from sklearn.ensemble import IsolationForest

ai_bp = Blueprint("ai", __name__, url_prefix="/api/ai")

@ai_bp.route("/predict/<int:server_id>", methods=["GET"])
def predict_anomaly(server_id):
    # ---------------------------------------
    # 1. Fetch LAST 100 metrics for server
    # ---------------------------------------
    metrics = (
        Metric.query
        .filter_by(server_id=server_id)
        .order_by(Metric.timestamp.desc())
        .limit(100)
        .all()
    )

    if len(metrics) < 10:
        return jsonify({
            "status": "NOT_ENOUGH_DATA",
            "message": "At least 10 metrics required for AI prediction"
        })

    # ---------------------------------------
    # 2. Prepare data for Isolation Forest
    # ---------------------------------------
    X = np.array([
        [m.cpu, m.ram, m.disk, m.temperature]
        for m in metrics
    ])

    # ---------------------------------------
    # 3. Train Isolation Forest
    # ---------------------------------------
    model = IsolationForest(
        n_estimators=1000,
        contamination=0.1,
        random_state=42
    )

    model.fit(X)

    predictions = model.predict(X)
    anomaly_count = int((predictions == -1).sum())

    # ---------------------------------------
    # 4. Generate AI Summary
    # ---------------------------------------
    health = "HEALTHY"
    risk = "LOW"

    if anomaly_count > 15:
        health = "UNSTABLE"
        risk = "HIGH"
    elif anomaly_count > 5:
        health = "MODERATE"
        risk = "MEDIUM"

    return jsonify({
        "total_records": len(metrics),
        "anomalies_detected": anomaly_count,
        "health_status": health,
        "risk_level": risk,
        "prediction_window": "Next 1 Hour"
    })
