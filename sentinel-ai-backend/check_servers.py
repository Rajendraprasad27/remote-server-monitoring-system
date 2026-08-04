from app import app
from database.models import Server

with app.app_context():
    servers = Server.query.all()

    print("\n🖥️  SERVERS IN DATABASE")
    print(f"Total servers: {len(servers)}\n")

    for s in servers:
        print(
            f"ID={s.id} | "
            f"Name={s.name} | "
            f"IP={s.ip} | "
            f"Status={s.status}"
        )
