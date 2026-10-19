# Sentinel AI - Remote Server Monitoring System

Sentinel AI is a modern, full-stack remote server telemetry and monitoring dashboard. It allows you to monitor CPU usage, memory (RAM), disk storage, and temperature across multiple remote servers in real time. It features a standalone client-side monitoring agent, a Flask-based telemetry storage API, and a React dashboard featuring interactive charts and automated alerts.

---

## 🏗️ Architecture Overview

The system consists of three main components:

1. **Dashboard (Frontend)**: Built with **React**, **Vite**, and **TypeScript**. It offers real-time visualization of telemetry statistics using interactive charts (**Chart.js** & **Recharts**), server management, and automated alert logs.
2. **REST API (Backend)**: Built with **Python** & **Flask**. It receives metrics, logs them to the database, tracks server connection statuses, triggers warning alerts when resources exceed safety limits, and processes data using SQLite.
3. **Telemetry Agent (Client)**: A lightweight **Python** background script running on target servers. It collects local telemetry metrics (using `psutil`) and pushes them to the Flask REST API every 5 seconds.

---

## 🛠️ Tools & Technologies Used

### Frontend Dashboard
* **Framework**: React 19 (TypeScript)
* **Build Tool**: Vite 6
* **Data Visualization**: Chart.js, Recharts, React Chartjs 2
* **API Client**: Axios & native fetch
* **Styling**: Modern CSS layouts & responsive design
* **Testing**: Cypress (E2E testing)
* **AI Telemetry Summary**: Google Gen AI SDK (`@google/genai`)

### Backend REST API
* **Language & Framework**: Python 3, Flask
* **Database**: SQLite (managed with **Flask-SQLAlchemy**)
* **Cross-Origin Requests**: Flask-CORS
* **Metrics & Analytics**: Scikit-Learn, psutil, python-dotenv

### Monitoring Agent
* **Language**: Python 3
* **System Metrics Utility**: `psutil`
* **HTTP Client**: `requests`

---

## 🚀 How to Run the Project

Follow these steps to run all components locally:

### 1. Run the Backend REST API

Go to the `sentinel-ai-backend` directory and set up a Python virtual environment:

```bash
# Navigate to backend folder
cd sentinel-ai-backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install the required packages
pip install -r requirements.txt

# Run the Flask server
python app.py
```
The backend server will launch at **`http://127.0.0.1:5000`** and automatically initialize an SQLite database (`sentinel.db`) in the `instance/` folder.

---

### 2. Run the Monitoring Agent

The agent monitors system health and reports it to the backend server. You can run it on your local machine (to simulate a monitored server) or deploy it on target servers:

```bash
# Keep the backend virtual environment active OR ensure psutil and requests are installed
# Navigate to backend agent directory
cd sentinel-ai-backend/agent

# Run the monitoring script
python monitor_agent.py
```
*The agent will begin scanning your system metrics and sending reports to the backend every 5 seconds.*

---

### 3. Run the Frontend Dashboard

Go to the `sentinel-ai-frontend` directory and start the Vite dev server:

```bash
# Navigate to frontend folder
cd sentinel-ai-frontend

# Install node dependencies
npm install

# Create/Verify your local environment configuration in .env.local:
# VITE_API_BASE_URL=http://localhost:5000/api

# Start the React application
npm run dev
```
Open **`http://localhost:5173`** (or the URL displayed in your terminal) in your browser to view the interactive monitoring dashboard.

---

