from flask import Blueprint, request, jsonify

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    if data["email"] == "admin@sentinel.ai":
        return jsonify({"token": "demo-token"})
    return jsonify({"error": "Invalid credentials"}), 401
