import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 8000,
});

export default function GameOnline() {
    const { code } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [lobby, setLobby] = useState(null);
    const [me, setMe] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatText, setChatText] = useState("");
    const [error, setError] = useState("");
    const [loadingLobby, setLoadingLobby] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const chatBoxRef = useRef(null);

    const resetError = () => setError("");

    const formatRole = (role) => {
        if (!role) return "unknown role";
        const lower = role.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    };

    const loadLobby = useCallback(async () => {
        if (!code) return;
        try {
            setLoadingLobby(true);
            const res = await api.get(`/lobbies/${code}`);
            setLobby(res.data);
            resetError();
        } catch {
            setError("Lobby not found or could not be loaded.");
        } finally {
            setLoadingLobby(false);
        }
    }, [code]);

    const loadMe = useCallback(async () => {
        if (!user || !code) return;
        try {
            const res = await api.get(`/lobbies/${code}/me/${user.id}`);
            setMe(res.data);
        } catch {
            // user might not be joined yet -> ignore
        }
    }, [user, code]);

    const loadMessages = useCallback(async () => {
        if (!code) return;
        try {
            const res = await api.get(`/chat/${code}`);
            setMessages(res.data);
        } catch {
            // ignore chat loading errors silently
        }
    }, [code]);

    // Clear lobby code if tab/window is closed while in a game
    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.removeItem("werewolves_lobby_code");
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    // Initial load & polling
    useEffect(() => {
        if (!user) {
            navigate("/auth");
            return;
        }

        loadLobby();
        loadMe();
        loadMessages();

        const intervalId = setInterval(() => {
            loadLobby();
            loadMessages();
        }, 4000);

        return () => clearInterval(intervalId);
    }, [user, navigate, loadLobby, loadMe, loadMessages]);

    // Auto-scroll Chat nach unten bei neuen Messages
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    // 🔁 WICHTIG: Auto-Redirect für ALLE Spieler, wenn das Spiel gestartet wurde
    useEffect(() => {
        if (lobby?.status === "IN_GAME") {
            navigate(`/game/${code}`);
        }
    }, [lobby, code, navigate]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!chatText.trim() || !user || !code) return;

        try {
            setLoadingChat(true);
            await api.post(`/chat/${code}`, {
                userId: user.id,
                message: chatText.trim(),
            });
            setChatText("");
            await loadMessages();
            resetError();
        } catch {
            setError("Could not send message.");
        } finally {
            setLoadingChat(false);
        }
    };

    // Lobby verlassen
    const leaveLobby = async () => {
        try {
            resetError();

            if (user && code) {
                // optional: Backend informieren, dass der Spieler die Lobby verlässt
                try {
                    await api.post(`/lobbies/${code}/leave`, { userId: user.id });
                } catch {
                    // Fehler beim Leave-Call ignorieren oder loggen
                }
            }
        } finally {
            localStorage.removeItem("werewolves_lobby_code");
            navigate("/");
        }
    };

    // Robuste Host-Erkennung
    const isHost =
        !!(
            (lobby && user && lobby.hostUserId === user.id) ||
            (me && me.isHost) ||
            (lobby &&
                user &&
                Array.isArray(lobby.players) &&
                lobby.players.some((p) => p.id === user.id && p.isHost))
        ) && !!lobby;

    // Spiel starten (Host) -> setzt Status auf IN_GAME
    const startGame = async () => {
        if (!code || !user) return;

        try {
            resetError();

            await api.post(`/lobbies/${code}/start`, {
                userId: user.id,
            });

            // WICHTIG: kein navigate hier.
            // Alle Clients werden durch das Lobby-Polling + useEffect oben
            // automatisch weitergeleitet, sobald status === "IN_GAME" ist.
        } catch (e) {
            setError(e?.response?.data?.error || "Could not start game.");
        }
    };

    return (
        <div
            className="min-vh-100 d-flex align-items-stretch"
            style={{
                background:
                    "radial-gradient(circle at top, #111827 0, #020617 55%, #000 100%)",
                color: "#e5e7eb",
            }}
        >
            <div className="container py-4">
                <div className="row g-4">
                    {/* LEFT SIDE: Lobby & Players */}
                    <div className="col-lg-7">
                        <div
                            className="glass-panel p-4 mb-3"
                            style={{
                                background: "rgba(15,23,42,0.9)",
                                border: "1px solid rgba(148,163,184,0.3)",
                                borderRadius: "1rem",
                            }}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div>
                                    <div className="small" style={{ color: "#9ca3af" }}>
                                        Lobby code
                                    </div>
                                    <div className="h4 mb-0 text-danger fw-bold">{code}</div>
                                </div>

                                <div className="d-flex flex-column align-items-end">
                                    <div className="small mb-1" style={{ color: "#9ca3af" }}>
                                        {lobby ? (
                                            <>
                                                Players: {lobby.players.length}
                                                <br />
                                                Status: {lobby.status}
                                            </>
                                        ) : loadingLobby ? (
                                            "Loading lobby..."
                                        ) : (
                                            "Lobby not loaded"
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-outline-light btn-sm"
                                        onClick={leaveLobby}
                                    >
                                        Leave lobby
                                    </button>
                                </div>
                            </div>

                            {me && (
                                <div className="alert alert-dark border-danger small mb-0">
                                    You are <strong>{formatRole(me.role)}</strong> – keep it
                                    secret!
                                </div>
                            )}
                        </div>

                        <div
                            className="glass-panel p-3"
                            style={{
                                background: "rgba(15,23,42,0.9)",
                                border: "1px solid rgba(148,163,184,0.3)",
                                borderRadius: "1rem",
                            }}
                        >
                            <h3 className="h5 mb-3" style={{ color: "#f9fafb" }}>
                                Players
                            </h3>
                            {lobby ? (
                                <>
                                    <ul className="list-group list-group-flush bg-transparent">
                                        {lobby.players.map((p) => (
                                            <li
                                                key={p.id}
                                                className="list-group-item bg-transparent text-light d-flex justify-content-between align-items-center"
                                                style={{
                                                    background: "rgba(15,23,42,0.75)",
                                                    borderColor: "rgba(55,65,81,0.6)",
                                                }}
                                            >
                                                <div>
                                                    {p.displayName}
                                                    {p.isHost && (
                                                        <span className="badge bg-danger ms-2">Host</span>
                                                    )}
                                                    {me && me.userId === p.id && (
                                                        <span className="badge bg-info ms-2">You</span>
                                                    )}
                                                </div>
                                                <div
                                                    className="small"
                                                    style={{ color: "#9ca3af" }}
                                                >
                                                    {p.alive ? "Alive" : "Dead"}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Start-Button: Host + mind. 5 Spieler + nicht bereits im Game */}
                                    {isHost &&
                                        Array.isArray(lobby.players) &&
                                        lobby.players.length >= 5 &&
                                        lobby.status !== "IN_GAME" && (
                                            <div className="mt-3 d-flex justify-content-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-success btn-sm"
                                                    onClick={startGame}
                                                >
                                                    Start game
                                                </button>
                                            </div>
                                        )}
                                </>
                            ) : (
                                <p className="text-secondary mb-0">
                                    {loadingLobby ? "Loading players…" : "No lobby data."}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* RIGHT SIDE: Chat */}
                    <div className="col-lg-5">
                        <div
                            className="glass-panel p-3 mb-3"
                            style={{
                                background: "rgba(15,23,42,0.9)",
                                border: "1px solid rgba(148,163,184,0.3)",
                                borderRadius: "1rem",
                            }}
                        >
                            <h3 className="h5 mb-2" style={{ color: "#f9fafb" }}>
                                Village chat
                            </h3>
                            <div
                                ref={chatBoxRef}
                                style={{
                                    maxHeight: "260px",
                                    overflowY: "auto",
                                    borderRadius: "0.75rem",
                                    border: "1px solid rgba(148,163,184,0.3)",
                                    padding: "0.5rem 0.75rem",
                                    background: "rgba(15,23,42,0.85)",
                                }}
                            >
                                {messages.length === 0 ? (
                                    <p className="small" style={{ color: "#9ca3af" }}>
                                        No messages yet. Start the discussion!
                                    </p>
                                ) : (
                                    messages.map((m) => (
                                        <div key={m.id} className="mb-1 small">
                      <span className="text-danger fw-semibold">
                        {m.username}:
                      </span>{" "}
                                            <span className="text-light">{m.content}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                            <form
                                onSubmit={sendMessage}
                                className="mt-2 d-flex gap-2 align-items-center"
                            >
                                <input
                                    type="text"
                                    className="form-control bg-dark text-light border-secondary"
                                    value={chatText}
                                    onChange={(e) => setChatText(e.target.value)}
                                    placeholder="Say something to the village…"
                                />
                                <button
                                    type="submit"
                                    className="btn btn-outline-light"
                                    style={{ whiteSpace: "nowrap" }}
                                    disabled={loadingChat || !user}
                                >
                                    {loadingChat ? "Sending…" : "Send"}
                                </button>
                            </form>
                        </div>

                        {error && (
                            <div className="alert alert-danger py-2 small mb-2">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
