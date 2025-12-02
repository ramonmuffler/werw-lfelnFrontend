import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function AuthPage() {
  const { user, loading, register, login, logout } = useAuth();
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }
    const action = mode === "login" ? login : register;
    const result = await action(username.trim(), password);
    if (!result.success) {
      setError(result.error);
    }
  };

  if (user) {
    return (
      <div className="container py-5 text-light">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="glass-panel p-4">
              <h2 className="h4 mb-3">You are logged in</h2>
              <p className="mb-2">
                <strong>{user.username}</strong>
              </p>
              <p className="small text-secondary mb-4">
                Villager wins: {user.villagerWins} · Werewolf wins:{" "}
                {user.werewolfWins}
              </p>
              <button type="button" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-bg-dark min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'radial-gradient(circle at top, #1f2933 0, #050509 55%, #000 100%)', minHeight: '100vh', width: '100vw' }}>
      <div className="container" style={{ maxWidth: 600 }}>
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="glass-panel p-4" style={{ background: 'rgba(17,22,23,0.93)', borderRadius: 18, boxShadow: '0 10px 38px #0008', border: '1.5px solid #ef444444' }}>
              {/* GUT SICHTBARE MODUS-TABS/Toggles */}
              <div className="d-flex justify-content-center gap-2 mb-4">
                <button
                  type="button"
                  aria-label="Show Login"
                  className={`btn btn-lg fw-bold ${mode === "login" ? "btn-danger" : "btn-outline-danger"}`}
                  style={{ borderRadius: "999px", minWidth: 140, opacity: mode === "login" ? 1 : 0.75, boxShadow: mode === "login" ? '0 2px 18px #b91c1c33' : undefined, color: mode === "login" ? 'white' : '#df2c2c', background: mode === "login" ? undefined : 'transparent' }}
                  onClick={() => setMode("login")}
                  tabIndex={0}
                >
                  Login
                </button>
                <button
                  type="button"
                  aria-label="Show Register"
                  className={`btn btn-lg fw-bold ${mode === "register" ? "btn-danger" : "btn-outline-danger"}`}
                  style={{ borderRadius: "999px", minWidth: 140, opacity: mode === "register" ? 1 : 0.75, boxShadow: mode === "register" ? '0 2px 18px #b91c1c33' : undefined, color: mode === "register" ? 'white' : '#df2c2c', background: mode === "register" ? undefined : 'transparent' }}
                  onClick={() => setMode("register")}
                  tabIndex={0}
                >
                  Register
                </button>
              </div>
              <h2 className="h3 mb-3 text-center fw-bold" style={{ color: '#fff' }}>
                {mode === "login" ? "Login to your account" : "Create a new account"}
              </h2>
              {error && (
                <div className="alert alert-danger py-2 small text-center">{error}</div>
              )}
              <form onSubmit={onSubmit} className="text-start mt-3">
                <div className="mb-3">
                  <label className="form-label" style={{ color: '#fff', fontWeight: 500 }}>Username</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-light border-secondary"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    placeholder="Choose a username"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: '#fff', fontWeight: 500 }}>Password</label>
                  <input
                    type="password"
                    className="form-control bg-dark text-light border-secondary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={mode === "register" ? "new-password" : "current-password"}
                    placeholder="Your password"
                  />
                </div>
                <div className="d-flex justify-content-center">
                  <button type="submit" disabled={loading} className="mt-1 w-75 btn btn-danger btn-lg" style={{ borderRadius: 999, fontWeight: 700 }}>
                    {loading
                      ? "Please wait..."
                      : mode === "login"
                      ? "Login"
                      : "Register"}
                  </button>
                </div>
              </form>
              <div className="text-center mt-3 text-secondary small">
                {mode === "login"
                  ? "Don't have an account yet? Click Register above."
                  : "Already have an account? Click Login above."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


