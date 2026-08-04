import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AlertsPage from "./pages/AlertsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import FeedbackPage from "./pages/FeedbackPage";
import ServerDetailsPage from "./pages/ServerDetailsPage";

type Page = "dashboard" | "alerts" | "analytics" | "feedback" | "server";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [selectedServerId, setSelectedServerId] = useState<number | null>(null);

  // -----------------------------------------
  // Check auth on app load
  // -----------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!token);
  }, []);

  // -----------------------------------------
  // LOGIN VIEW
  // -----------------------------------------
  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={() => {
          localStorage.setItem("auth_token", "demo-token");
          setIsAuthenticated(true);
        }}
      />
    );
  }

  // -----------------------------------------
  // MAIN APP VIEW
  // -----------------------------------------
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar
        activePage={activePage}
        onPageChange={(page) => {
          setActivePage(page as Page);
          setSelectedServerId(null);
        }}
        onLogout={() => {
          localStorage.removeItem("auth_token");
          setIsAuthenticated(false);
          setActivePage("dashboard");
        }}
      />

      <main className="flex-1 overflow-y-auto p-6">
        {activePage === "dashboard" && (
          <DashboardPage
            onServerClick={(id: number) => {
              setSelectedServerId(id);
              setActivePage("server");
            }}
          />
        )}

        {activePage === "server" && selectedServerId !== null && (
          <ServerDetailsPage
            serverId={selectedServerId}
            onBack={() => setActivePage("dashboard")}
          />
        )}

        {activePage === "alerts" && <AlertsPage />}
        {activePage === "analytics" && <AnalyticsPage />}
        {activePage === "feedback" && <FeedbackPage />}
      </main>
    </div>
  );
}
