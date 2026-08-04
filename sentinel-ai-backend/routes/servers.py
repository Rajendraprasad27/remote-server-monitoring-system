from flask import Blueprint, request, jsonify
from database.db import db
from database.models import Server

servers_bp = Blueprint("servers", __name__)

# =========================================
# POST: Add server manually (Admin action)
# =========================================
@servers_bp.route("/api/servers", methods=["POST"])
def add_server():
    data = request.json

    name = data.get("name")
    ip = data.get("ip")

    if not name or not ip:
        return jsonify({"error": "Server name and IP are required"}), 400

    # Prevent duplicate server by IP
    existing = Server.query.filter_by(ip=ip).first()
    if existing:
        return jsonify({"message": "Server already exists"}), 200

    server = Server(
        name=name,
        ip=ip,
        status="ACTIVE"
    )

    db.session.add(server)
    db.session.commit()

    return jsonify({
        "message": "Server added successfully",
        "server_id": server.id
    })


# =========================================
# GET: Fetch all registered servers
# =========================================
@servers_bp.route("/api/servers", methods=["GET"])
def get_servers():
    servers = Server.query.order_by(Server.id.asc()).all()

    return jsonify([
        {
            "id": s.id,
            "name": s.name,
            "ip": s.ip,
            "status": s.status
        }
        for s in servers
    ])
