interface Props {
  activePage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
}

export default function Sidebar({
  activePage,
  onPageChange,
  onLogout,
}: Props) {
  return (
    <aside className="w-64 bg-[#020617] p-6 flex flex-col">
      <h1 className="text-xl font-bold mb-8">Sentinel AI</h1>

      <nav className="flex-1 space-y-2">
        {["dashboard", "alerts", "analytics", "feedback"].map((page) => (
          <button
            key={page}
            data-testid={`nav-${page}`}
            onClick={() => onPageChange(page)}
            className={`w-full text-left px-4 py-2 rounded ${
              activePage === page ? "bg-gray-700" : "hover:bg-gray-800"
            }`}
          >
            {page.charAt(0).toUpperCase() + page.slice(1)}
          </button>
        ))}
      </nav>

      <button
        data-testid="logout-button"
        onClick={onLogout}
        className="mt-6 text-red-400 hover:text-red-500"
      >
        Sign Out
      </button>
    </aside>
  );
}
