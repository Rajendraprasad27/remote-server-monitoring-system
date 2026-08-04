interface Props {
  onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: Props) {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="bg-[#111827] p-8 rounded w-96">
        <h1
          className="text-2xl font-bold mb-6 text-center"
          data-testid="login-title"
        >
          Sentinel AI Login
        </h1>

        <input
          data-testid="email-input"
          type="text"
          placeholder="Email"
          className="w-full p-2 mb-4 rounded bg-[#020617] border border-gray-700"
        />

        <input
          data-testid="password-input"
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-6 rounded bg-[#020617] border border-gray-700"
        />

        <button
          data-testid="login-button"
          onClick={onLoginSuccess}
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}
