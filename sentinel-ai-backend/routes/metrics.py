from flask import Blueprint, request, jsonify
from database.db import db
from database.models import Server, Metric, Alert
from datetime import datetime

metrics_bp = Blueprint("metrics", __name__)

@metrics_bp.route("/api/metrics", methods=["POST"])
def receive_metrics():
    data = request.json

    server_name = data.get("server_name")
    server_ip = data.get("server_ip")

    cpu = data.get("cpu")
    ram = data.get("ram")
    disk = data.get("disk")
    temperature = data.get("temperature")

    # 🔒 ALWAYS reuse same server by IP
    server = Server.query.filter_by(ip=server_ip).first()

    if not server:
        server = Server(
            name=server_name,
            ip=server_ip,
            status="ACTIVE"
        )
        db.session.add(server)
        db.session.commit()

    metric = Metric(
        server_id=server.id,
        cpu=cpu,
        ram=ram,
        disk=disk,
        temperature=temperature,
        timestamp=datetime.utcnow()
    )
    db.session.add(metric)

    # Threshold alerts (NO AI)
    if cpu > 90 or temperature > 90:
        severity = "CRITICAL"
    elif cpu > 85 or temperature > 75:
        severity = "WARNING"
    else:
        severity = None

    if severity:
        alert = Alert(
            server_id=server.id,
            severity=severity,
            message=f"{severity}: CPU={cpu}%, TEMP={temperature}°C"
        )
        db.session.add(alert)

    db.session.commit()

    return jsonify({
        "message": "Metrics stored",
        "server_id": server.id
    })


@metrics_bp.route("/api/metrics/<int:server_id>", methods=["GET"])
def get_metrics_by_server(server_id):
    metrics = (
        Metric.query
        .filter_by(server_id=server_id)
        .order_by(Metric.timestamp.desc())
        .limit(100)
        .all()
    )

    return jsonify([
        {
            "cpu": m.cpu,
            "ram": m.ram,
            "disk": m.disk,
            "temperature": m.temperature,
            "timestamp": m.timestamp.isoformat()
        }
        for m in reversed(metrics)
    ])
