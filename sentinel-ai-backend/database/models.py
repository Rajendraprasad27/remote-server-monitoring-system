from database.db import db
from datetime import datetime

# =========================
# User Table
# =========================
class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)


# =========================
# Server Table
# =========================
class Server(db.Model):
    __tablename__ = "server"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    # 🔒 UNIQUE IP prevents duplicate servers
    ip = db.Column(db.String(50), unique=True, nullable=False)

    status = db.Column(db.String(20), default="ACTIVE")

    # 🔗 Relationships
    metrics = db.relationship(
        "Metric",
        backref="server",
        cascade="all, delete-orphan",
        lazy=True
    )

    alerts = db.relationship(
        "Alert",
        backref="server",
        cascade="all, delete-orphan",
        lazy=True
    )


# =========================
# Metric Table
# =========================
class Metric(db.Model):
    __tablename__ = "metric"

    id = db.Column(db.Integer, primary_key=True)

    # 🔗 FK to Server
    server_id = db.Column(
        db.Integer,
        db.ForeignKey("server.id"),
        nullable=False
    )

    cpu = db.Column(db.Float, nullable=False)
    ram = db.Column(db.Float, nullable=False)
    disk = db.Column(db.Float, nullable=False)
    temperature = db.Column(db.Float, nullable=False)

    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


# =========================
# Alert Table
# =========================
class Alert(db.Model):
    __tablename__ = "alert"

    id = db.Column(db.Integer, primary_key=True)

    # 🔗 FK to Server
    server_id = db.Column(
        db.Integer,
        db.ForeignKey("server.id"),
        nullable=False
    )

    severity = db.Column(db.String(20), nullable=False)
    message = db.Column(db.String(200), nullable=False)

    resolved = db.Column(db.Boolean, default=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


# =========================
# Feedback Table
# =========================
class Feedback(db.Model):
    __tablename__ = "feedback"

    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer)
    comment = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
