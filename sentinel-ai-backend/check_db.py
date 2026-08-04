from app import app
from database.models import Server, Metric

with app.app_context():
    print("\n--- SERVERS ---")
    servers = Server.query.all()
    print(f"Total Servers: {len(servers)}")
    for s in servers:
        print(f"ID={s.id}, IP={s.ip}, Name={s.name}")

    print("\n--- METRICS ---")
    metrics = Metric.query.all()
    print(f"Total Metrics: {len(metrics)}")
    for m in metrics[:5]:
        print(f"ServerID={m.server_id}, CPU={m.cpu}, Time={m.timestamp}")
