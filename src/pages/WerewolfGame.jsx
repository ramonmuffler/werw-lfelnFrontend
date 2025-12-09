import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function WerewolfGame() {
    const { code } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/auth");
        }
    }, [user, navigate]);

    const leaveGame = () => {
        localStorage.removeItem("werewolves_lobby_code");
        navigate("/");
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
                <div
                    className="glass-panel p-4"
                    style={{
                        background: "rgba(15,23,42,0.9)",
                        border: "1px solid rgba(148,163,184,0.3)",
                        borderRadius: "1rem",
                    }}
                >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <div className="small" style={{ color: "#9ca3af" }}>
                                Game – Lobby code
                            </div>
                            <div className="h4 mb-0 text-danger fw-bold">{code}</div>
                        </div>
                        <button
                            type="button"
                            className="btn btn-outline-light btn-sm"
                            onClick={leaveGame}
                        >
                            Leave game
                        </button>
                    </div>

                    {/* Platzhalter für dein Werwölfe-Spiel */}
                    <p className="text-secondary">
                        Hier kannst du jetzt deinen Werwölfe-Spielablauf bauen
                        (Tag/Nacht, Votes, Rollenaktionen, etc.). Aktuell ist das nur
                        ein Platzhalter-Frontend.
                    </p>
                </div>
            </div>
        </div>
    );
}
