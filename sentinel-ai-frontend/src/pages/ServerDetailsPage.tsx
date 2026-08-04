import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

interface Metric {
  cpu: number;
  ram: number;
  disk: number;
  temperature: number;
  timestamp: string;
}

interface Props {
  serverId: number;
  onBack: () => void;
}

export default function ServerDetailsPage({ serverId, onBack }: Props) {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // Fetch metrics (last 100 only)
  // --------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    const fetchMetrics = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/metrics/${serverId}`
        );

        if (isMounted) {
          setMetrics(res.data.slice(-100)); // ✅ last 100 only
        }
      } catch (err) {
        console.error("Failed to fetch metrics", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMetrics();

    const interval = setInterval(fetchMetrics, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [serverId]);

  // --------------------------------------------------
  // Loading state
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="text-gray-400">
        Loading metrics...
      </div>
    );
  }

  // --------------------------------------------------
  // No data state
  // --------------------------------------------------
  if (metrics.length === 0) {
    return (
      <div className="text-white">
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
        >
          ← Back
        </button>

        <p className="text-gray-400">No metrics received yet.</p>
      </div>
    );
  }

  // --------------------------------------------------
  // Chart config
  // --------------------------------------------------
  const chartData = {
    labels: metrics.map((m) =>
      new Date(m.timestamp).toLocaleTimeString()
    ),
    datasets: [
      {
        label: "CPU (%)",
        data: metrics.map((m) => m.cpu),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.3,
      },
      {
        label: "RAM (%)",
        data: metrics.map((m) => m.ram),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.3,
      },
      {
        label: "Temperature (°C)",
        data: metrics.map((m) => m.temperature),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.2)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "white" },
      },
    },
    scales: {
      x: {
        ticks: { color: "white" },
      },
      y: {
        ticks: { color: "white" },
      },
    },
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div className="text-white">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-6">
        Server Metrics (Last 100 Records)
      </h2>

      <div className="bg-[#111827] p-4 rounded">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
