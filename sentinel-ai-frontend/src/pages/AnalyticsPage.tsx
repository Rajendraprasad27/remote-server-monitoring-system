import { useEffect, useState } from "react";
import axios from "axios";

interface Server {
  id: number;
  name: string;
  ip: string;
}

export default function AnalyticsPage() {
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServerId, setSelectedServerId] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // -----------------------------------------
  // Fetch servers for dropdown
  // -----------------------------------------
  useEffect(() => {
    const fetchServers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/servers");
        setServers(res.data);
      } catch (err) {
        console.error("Failed to fetch servers", err);
      }
    };

    fetchServers();
  }, []);

  // -----------------------------------------
  // Generate AI Prediction
  // -----------------------------------------
  const generateInsight = async () => {
    if (!selectedServerId) {
      alert("Please select a server");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/ai/predict/${selectedServerId}`
      );
      setResult(res.data);
    } catch (err) {
      alert("AI prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-6">Predictive Analytics</h1>

      {/* ------------------ Controls ------------------ */}
      <div className="bg-[#111827] p-6 rounded mb-6 flex items-center gap-4">
        <div>
          <label className="block text-gray-400 mb-1">
            Select Server
          </label>
          <select
            className="p-2 bg-[#020617] border border-gray-700 rounded w-64"
            value={selectedServerId ?? ""}
            onChange={(e) => setSelectedServerId(Number(e.target.value))}
          >
            <option value="">-- Choose Server --</option>
            {servers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.ip})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={generateInsight}
          className="mt-6 px-6 py-2 bg-purple-600 rounded hover:bg-purple-700"
        >
          {loading ? "Analyzing..." : "Generate AI Insight"}
        </button>
      </div>

      {/* ------------------ Results ------------------ */}
      {result && (
        <div className="bg-[#111827] p-6 rounded">
          <h2 className="text-xl font-semibold mb-4">
            AI Health Summary
          </h2>

          {result.status === "NOT_ENOUGH_DATA" ? (
            <p className="text-yellow-400">
              ⚠ {result.message}
            </p>
          ) : (
            <>
              <p>📊 Total Records: {result.total_records}</p>
              <p>⚠️ Anomalies Detected: {result.anomalies_detected}</p>
              <p>
                🧠 Health Status:{" "}
                <b className="text-blue-400">
                  {result.health_status}
                </b>
              </p>
              <p>
                🔥 Risk Level:{" "}
                <b className="text-red-400">
                  {result.risk_level}
                </b>
              </p>
              <p>⏱ Prediction Window: {result.prediction_window}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
