import { useEffect, useState } from "react";
import axios from "axios";

interface Server {
  id: number;
  name: string;
  ip: string;
  status: string;
}

interface Props {
  onServerClick: (serverId: number) => void;
}

export default function DashboardPage({ onServerClick }: Props) {
  const [servers, setServers] = useState<Server[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(false);

  // -----------------------------------------
  // Fetch servers from backend
  // -----------------------------------------
  const fetchServers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/servers");
      setServers(res.data);
    } catch (error) {
      console.error("Failed to fetch servers", error);
    }
  };

  useEffect(() => {
    fetchServers();
  }, []);

  // -----------------------------------------
  // Add new server manually
  // -----------------------------------------
  const addServer = async () => {
    if (!name || !ip) {
      alert("Please enter server name and IP address");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/servers", {
        name,
        ip,
      });

      setName("");
      setIp("");
      setShowModal(false);
      fetchServers();
    } catch (error) {
      alert("Failed to add server");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // UI
  // -----------------------------------------
  return (
    <div className="p-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1
          className="text-2xl font-bold"
          data-testid="dashboard-title"
        >
          System Overview
        </h1>

        <button
          data-testid="add-server-button"
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          + Add Server
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-[#111827] p-4 rounded">
          <p className="text-gray-400">Total Servers</p>
          <p
            className="text-2xl font-bold"
            data-testid="total-servers"
          >
            {servers.length}
          </p>
        </div>

        <div className="bg-[#111827] p-4 rounded">
          <p className="text-gray-400">Active Alerts</p>
          <p className="text-2xl font-bold">0</p>
        </div>

        <div className="bg-[#111827] p-4 rounded">
          <p className="text-gray-400">Network Load</p>
          <p className="text-2xl font-bold">128 Mbps</p>
        </div>

        <div className="bg-[#111827] p-4 rounded">
          <p className="text-gray-400">System Health</p>
          <p className="text-2xl font-bold text-green-400">
            Optimal
          </p>
        </div>
      </div>

      {/* Server Table */}
      <div
        className="bg-[#111827] rounded p-4"
        data-testid="server-table"
      >
        <h2 className="text-xl mb-4">Infrastructure Units</h2>

        {servers.length === 0 ? (
          <p className="text-gray-400">No servers registered</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="py-2">Name</th>
                <th>IP Address</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {servers.map((server) => (
                <tr
                  key={server.id}
                  data-testid="server-row"
                  onClick={() => onServerClick(server.id)}
                  className="border-b border-gray-800 cursor-pointer hover:bg-gray-800"
                >
                  <td className="py-2">{server.name}</td>
                  <td>{server.ip}</td>
                  <td className="text-green-400">
                    {server.status || "ACTIVE"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Server Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center"
          data-testid="add-server-modal"
        >
          <div className="bg-[#111827] p-6 rounded w-96">
            <h2 className="text-xl mb-4">Add New Server</h2>

            <input
              data-testid="server-name-input"
              type="text"
              placeholder="Server Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-3 p-2 rounded bg-[#020617] border border-gray-700"
            />

            <input
              data-testid="server-ip-input"
              type="text"
              placeholder="Server IP Address"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="w-full mb-4 p-2 rounded bg-[#020617] border border-gray-700"
            />

            <div className="flex justify-end gap-3">
              <button
                data-testid="cancel-add-server"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 rounded"
              >
                Cancel
              </button>

              <button
                data-testid="confirm-add-server"
                onClick={addServer}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
              >
                {loading ? "Adding..." : "Add Server"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
