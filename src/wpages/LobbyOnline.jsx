import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const LOBBY_STORAGE_KEY = "werewolves_lobby_code";
const API_BASE_URL = "http://localhost:8080/api";

/**
 * @typedef {Object} LobbyPlayer
 * @property {string} id
 * @property {string} displayName
 * @property {boolean} isHost
 * @property {boolean} alive
 */

/**
 * @typedef {Object} Lobby
 * @property {string} code
 * @property {string} hostUserId
 * @property {"WAITING"|"IN_PROGRESS"|"FINISHED"} status
 * @property {LobbyPlayer[]} players
 */

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});

export default function LobbyOnline() {
  const { user } = useAuth();
  const navigate = useNavigate();

  /** @type {[Lobby|null, Function]} */
  const [lobby, setLobby] = useState(null);
  const [codeInput, setCodeInput] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("create"); // "create" | "join"

  // Initial auth & lobby restore
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setDisplayName(user.username);

    const storedCode = localStorage.getItem(LOBBY_STORAGE_KEY);
    if (storedCode) {
      navigate(`/game-online/${storedCode}`);
    }
  }, [user, navigate]);

  const resetError = () => setError("");

  const handleModeSwitch = useCallback((newMode) => {
    setMode(newMode);
    setError("");
    if (newMode === "create") {
      setCodeInput("");
    }
  }, []);

  const validateCommon = () => {
    if (!user) {
      navigate("/auth");
      return false;
    }
    if (!displayName.trim()) {
      setError("Please enter a display name.");
      return false;
    }
    return true;
  };

  const handleCreate = useCallback(async () => {
    if (!validateCommon()) return;

    setLoading(true);
    resetError();

    try {
      const res = await api.post("/lobbies", {
        hostUserId: user.id,
        hostDisplayName: displayName.trim(),
      });

      const createdLobby = res.data;
      setLobby(createdLobby);
      localStorage.setItem(LOBBY_STORAGE_KEY, createdLobby.code);
      navigate(`/game-online/${createdLobby.code}`);
    } catch (e) {
      const msg =
          e.response?.data?.error ||
          (e.code === "ECONNABORTED"
              ? "Server took too long to respond. Please try again."
              : "Could not create lobby.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [user, displayName, navigate]);

  const handleJoin = useCallback(async () => {
    if (!validateCommon()) return;

    if (!codeInput.trim()) {
      setError("Please enter a lobby code.");
      return;
    }

    setLoading(true);
    resetError();

    try {
      const code = codeInput.trim().toUpperCase();
      const res = await api.post(`/lobbies/${code}/join`, {
        userId: user.id,
        displayName: displayName.trim(),
      });

      const joinedLobby = res.data;
      setLobby(joinedLobby);
      localStorage.setItem(LOBBY_STORAGE_KEY, joinedLobby.code);
      navigate(`/game-online/${joinedLobby.code}`);
    } catch (e) {
      const msg =
          e.response?.data?.error ||
          (e.code === "ECONNABORTED"
              ? "Server took too long to respond. Please try again."
              : "Could not join lobby.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [user, codeInput, displayName, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "create") {
      handleCreate();
    } else {
      handleJoin();
    }
  };

  const isHost = lobby && user && lobby.hostUserId === user.id;
  const minPlayersReached = lobby?.players?.length >= 5;

  // Clear lobby code when window/tab is closed
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem(LOBBY_STORAGE_KEY);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
      <div
          className="min-vh-100 d-flex align-items-stretch"
          style={{
            background:
                "radial-gradient(circle at top, #111827 0, #020617 55%, #000 100%)",
            color: "#e5e7eb",
          }}
      >
        <div className="container py-5">
          <div className="row g-4">
            {/* LEFT: Create / Join Form */}
            <div className="col-lg-5">
              <div className="glass-panel p-4 h-100">
                {/* Tabs: Create | Join */}
                <div className="d-flex justify-content-center gap-2 mb-4">
                  <button
                      type="button"
                      aria-label="Create Lobby"
                      className={`btn btn-lg fw-bold ${
                          mode === "create" ? "btn-danger" : "btn-outline-danger"
                      }`}
                      style={{
                        borderRadius: "999px",
                        minWidth: 140,
                        opacity: mode === "create" ? 1 : 0.7,
                      }}
                      onClick={() => handleModeSwitch("create")}
                  >
                    Create Lobby
                  </button>
                  <button
                      type="button"
                      aria-label="Join Lobby"
                      className={`btn btn-lg fw-bold ${
                          mode === "join" ? "btn-danger" : "btn-outline-danger"
                      }`}
                      style={{
                        borderRadius: "999px",
                        minWidth: 140,
                        opacity: mode === "join" ? 1 : 0.7,
                      }}
                      onClick={() => handleModeSwitch("join")}
                  >
                    Join Lobby
                  </button>
                </div>

                <h2
                    className="h5 text-center fw-bold mb-3"
                    style={{ color: "#f9fafb" }}
                >
                  {mode === "create" ? "Create a new Lobby" : "Join an existing Lobby"}
                </h2>

                {error && (
                    <div className="alert alert-danger py-2 small mb-3">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="text-start">
                  {mode === "join" && (
                      <div className="mb-3">
                        <label
                            className="form-label"
                            style={{ color: "#e5e7eb", fontWeight: 500 }}
                        >
                          Lobby code
                        </label>
                        <input
                            type="text"
                            className="form-control bg-dark text-light border-secondary"
                            value={codeInput}
                            onChange={(e) => setCodeInput(e.target.value)}
                            placeholder="Enter lobby code"
                            maxLength={10}
                        />
                      </div>
                  )}

                  <div className="mb-3">
                    <label
                        className="form-label"
                        style={{ color: "#e5e7eb", fontWeight: 600 }}
                    >
                      Display name
                    </label>
                    <input
                        type="text"
                        className="form-control bg-dark text-light border-secondary"
                        value={displayName}
                        readOnly
                        placeholder="Name shown in the village"
                    />
                    <small className="text-muted">
                      Edit your account name to change this.
                    </small>
                  </div>

                  <div className="d-flex justify-content-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-75 btn btn-danger btn-lg d-flex justify-content-center align-items-center gap-2"
                        style={{ borderRadius: 999, fontWeight: 700 }}
                    >
                      {loading && (
                          <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                          />
                      )}
                      <span>
                      {mode === "create" ? "Create lobby as host" : "Join lobby"}
                    </span>
                    </button>
                  </div>
                </form>

                <p className="small mt-3 mb-0" style={{ color: "#e5e7eb" }}>
                  Minimum 5 players per lobby. Only the host can start the game.
                </p>
              </div>
            </div>

            {/* RIGHT: Lobby Info / Players */}
            <div className="col-lg-7">
              <div className="glass-panel p-4 h-100">
                <h2 className="h5 fw-bold mb-3" style={{ color: "#f9fafb" }}>
                  Players in the Lobby
                </h2>

                {!lobby ? (
                    <p className="mb-0 small" style={{ color: "#9ca3af" }}>
                      No lobby yet.{" "}
                      {mode === "create"
                          ? "Create a new one as host."
                          : "Join with your code."}
                    </p>
                ) : (
                    <>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <div className="small" style={{ color: "#9ca3af" }}>
                            Lobby code
                          </div>
                          <div className="h4 mb-0 text-danger fw-bold">
                            {lobby.code}
                          </div>
                        </div>
                        <div className="text-end small" style={{ color: "#9ca3af" }}>
                          Players: {lobby.players.length}
                          <br />
                          Status: {lobby.status}
                        </div>
                      </div>

                      <ul className="list-group list-group-flush bg-transparent mb-3">
                        {lobby.players.map((p) => (
                            <li
                                key={p.id}
                                className="list-group-item bg-transparent d-flex justify-content-between align-items-center"
                                style={{
                                  background: "rgba(15, 23, 42, 0.75)",
                                  borderColor: "rgba(55,65,81,0.6)",
                                }}
                            >
                        <span>
                          <span
                              style={{
                                color: p.isHost ? "#fca5a5" : "#e5e7eb",
                                fontWeight: p.isHost ? 700 : 500,
                              }}
                          >
                            {p.displayName}{" "}
                            {p.isHost && (
                                <span className="badge bg-danger ms-2">Host</span>
                            )}
                          </span>
                        </span>
                              <span
                                  className="small"
                                  style={{
                                    color: p.alive ? "#4ade80" : "#9ca3af",
                                    fontWeight: 600,
                                  }}
                              >
                          {p.alive ? "Alive" : "Out"}
                        </span>
                            </li>
                        ))}
                      </ul>

                      {isHost && lobby.status === "WAITING" && (
                          <button
                              type="button"
                              disabled={loading || !minPlayersReached}
                              onClick={() => navigate(`/game-online/${lobby.code}`)}
                              className="btn btn-warning mt-2"
                          >
                            {minPlayersReached
                                ? "Start game now"
                                : "Need at least 5 players"}
                          </button>
                      )}

                      {lobby.status === "IN_PROGRESS" && (
                          <button
                              type="button"
                              className="mt-2 btn btn-info"
                              onClick={() => navigate(`/game-online/${lobby.code}`)}
                          >
                            Go to ongoing game
                          </button>
                      )}
                    </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
