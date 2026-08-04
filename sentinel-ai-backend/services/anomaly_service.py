import numpy as np
from sklearn.ensemble import IsolationForest
from database.models import Metric, Alert
from database.db import db

# Initialize model (global – reused)
model = IsolationForest(
    n_estimators=1000,
    contamination=0.05,   # 5% anomalies
    random_state=42
)

MODEL_TRAINED = False

def train_model():
    global MODEL_TRAINED

    metrics = Metric.query.all()
    if len(metrics) < 20:
        return  # Not enough data

    X = np.array([
        [m.cpu, m.ram, m.disk, m.temperature]
        for m in metrics
    ])

    model.fit(X)
    MODEL_TRAINED = True


def detect_anomaly(metric: Metric):
    global MODEL_TRAINED

    if not MODEL_TRAINED:
        train_model()
        return None

    X = np.array([[metric.cpu, metric.ram, metric.disk, metric.temperature]])
    prediction = model.predict(X)

    # -1 = anomaly, 1 = normal
    if prediction[0] == -1:
        severity = "CRITICAL" if metric.cpu > 85 or metric.temperature > 75 else "WARNING"

        alert = Alert(
            server_id=metric.server_id,
            severity=severity,
            message=f"Anomalous behavior detected (CPU={metric.cpu}%, RAM={metric.ram}%)"
        )
        db.session.add(alert)
        db.session.commit()
        return alert

    return None
