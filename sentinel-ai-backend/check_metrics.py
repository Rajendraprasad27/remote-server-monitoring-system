from app import app
from database.models import Metric

with app.app_context():
    count = Metric.query.count()
    print(f"Total metrics in DB: {count}")
