from flask import Flask
from flask_cors import CORS
from database.db import db
from routes.metrics import metrics_bp
from routes.alerts import alerts_bp
from routes.servers import servers_bp
from routes.ai_analytics import ai_bp

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///sentinel.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

# Register routes
app.register_blueprint(metrics_bp)
app.register_blueprint(alerts_bp)
app.register_blueprint(servers_bp)
app.register_blueprint(ai_bp)

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
