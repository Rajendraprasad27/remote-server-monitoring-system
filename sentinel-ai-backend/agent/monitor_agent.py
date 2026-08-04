import psutil
import time
import requests
import socket
import random

# ==============================
# Backend API URL
# ==============================
BACKEND_URL = "http://localhost:5000/api/metrics"

# ==============================
# Get Server Name & IP
# ==============================
def get_server_info():
    hostname = socket.gethostname()

    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = "127.0.0.1"
    finally:
        s.close()

    return hostname, ip

# ==============================
# Collect System Metrics
# ==============================
def collect_metrics():
    cpu = psutil.cpu_percent(interval=1)
    ram = psutil.virtual_memory().percent
    disk = psutil.disk_usage("/").percent

    # ------------------------------------
    # Temperature (SIMULATED - WINDOWS SAFE)
    # ------------------------------------
    # Formula: base + CPU influence + noise
    temperature = round(40 + (cpu * 0.5) + random.uniform(-2, 2), 2)

    return cpu, ram, disk, temperature

# ==============================
# Send Metrics to Backend
# ==============================
def send_metrics():
    server_name, server_ip = get_server_info()
    cpu, ram, disk, temperature = collect_metrics()

    payload = {
        "server_name": server_name,
        "server_ip": server_ip,
        "cpu": cpu,
        "ram": ram,
        "disk": disk,
        "temperature": temperature
    }

    try:
        requests.post(BACKEND_URL, json=payload, timeout=5)
        print(
            f"[✓] Sent | CPU={cpu}% RAM={ram}% TEMP={temperature}°C IP={server_ip}"
        )
    except Exception as e:
        print("[✗] Failed to send metrics:", e)

# ==============================
# Main Loop
# ==============================
if __name__ == "__main__":
    print("🚀 Sentinel AI Monitoring Agent Started")
    print("📡 Sending metrics every 5 seconds...\n")

    while True:
        send_metrics()
        time.sleep(5)
