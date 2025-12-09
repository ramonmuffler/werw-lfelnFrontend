import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function WerewolfGame() {
    const { code } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Redirect falls nicht eingeloggt
    useEffect(() => {
        if (!user) {
            navigate("/auth");
        }
    }, [user, navigate]);

    // --- Spieler & Rollen ------------------------------------------------------

    const [players, setPlayers] = useState(() => {
        // Demo-Spieler – später mit echten Lobby-Daten ersetzen
        const base = [
            { id: "p1", name: "You", isYou: true, alive: true },
            { id: "p2", name: "Alice", isYou: false, alive: true },
            { id: "p3", name: "Bob", isYou: false, alive: true },
            { id: "p4", name: "Clara", isYou: false, alive: true },
            { id: "p5", name: "David", isYou: false, alive: true },
        ];

        // Rollen verteilen: 1 Werwolf (ab 7 Spielern z.B. 2 Werwölfe)
        const assignRoles = (list) => {
            const copy = [...list];
            const wolfCount = copy.length >= 7 ? 2 : 1;

            const indices = [];
            while (indices.length < wolfCount) {
                const idx = Math.floor(Math.random() * copy.length);
                if (!indices.includes(idx)) indices.push(idx);
            }

            return copy.map((p, index) => ({
                ...p,
                role: indices.includes(index) ? "WEREWOLF" : "VILLAGER",
            }));
        };

        return assignRoles(base);
    });

    const you = players.find((p) => p.isYou);
    const alivePlayers = players.filter((p) => p.alive);
    const aliveWolves = alivePlayers.filter((p) => p.role === "WEREWOLF");
    const aliveVillagers = alivePlayers.filter((p) => p.role === "VILLAGER");

    // --- Spielfluss / Phasen ---------------------------------------------------

    const [phase, setPhase] = useState("DAY"); // "DAY" | "NIGHT"
    const [isReady, setIsReady] = useState(false); // dein Ready-Status (nur lokal)

    // Tag: Anklagen & Voting
    const [accusations, setAccusations] = useState([]); // array von playerIds (max 2)
    const [yourVote, setYourVote] = useState(null); // playerId

    // Nacht: Werwolf-Ziel
    const [nightTargetId, setNightTargetId] = useState(null);

    // Ergebnis
    const [result, setResult] = useState(null); // { winner: "VILLAGERS"|"WEREWOLVES", youWon: bool }

    const leaveGame = () => {
        localStorage.removeItem("werewolves_lobby_code");
        navigate("/");
    };

    // Hilfsfunktion: Win/Loss prüfen
    const computeWinner = (list) => {
        const alive = list.filter((p) => p.alive);
        const wolves = alive.filter((p) => p.role === "WEREWOLF").length;
        const vill = alive.filter((p) => p.role === "VILLAGER").length;

        if (wolves === 0) return "VILLAGERS";
        if (wolves >= vill) return "WEREWOLVES";
        return null;
    };

    const killPlayer = (playerId) => {
        setPlayers((prev) => {
            const updated = prev.map((p) =>
                p.id === playerId ? { ...p, alive: false } : p
            );

            const winner = computeWinner(updated);
            if (winner) {
                const youPlayer = updated.find((p) => p.isYou);
                const youWon =
                    youPlayer &&
                    ((youPlayer.role === "VILLAGER" && winner === "VILLAGERS") ||
                        (youPlayer.role === "WEREWOLF" && winner === "WEREWOLVES"));

                setResult({
                    winner,
                    youWon,
                });
            }

            return updated;
        });
    };

    // --- Ready-Button (nur lokal, kein Server) --------------------------------

    const handleReadyClick = () => {
        // In einer echten Multi-Player-Version würdest du hier
        // deinen Ready-Status an den Server senden und auf
        // "alle ready" warten. Frontend-Demo: wir toggeln nur.
        setIsReady((prev) => !prev);
    };

    // --- Tag: Anklagen ---------------------------------------------------------

    const canAccuseMore =
        phase === "DAY" && accusations.length < 2 && !result && alivePlayers.length > 2;

    const handleAccuse = (playerId) => {
        if (!canAccuseMore) return;
        if (accusations.includes(playerId)) return;
        setAccusations((prev) => [...prev, playerId]);
    };

    const accusedPlayers = accusations
        .map((id) => players.find((p) => p.id === id))
        .filter(Boolean);

    // --- Tag: Voting -----------------------------------------------------------

    const handleSubmitVote = () => {
        if (!yourVote || accusations.length === 0 || !you || result) return;

        // Simulation: die anderen stimmen zufällig für einen der Angeklagten ab
        const aliveOthers = alivePlayers.filter((p) => !p.isYou);
        const votesByOthers = aliveOthers.map((p) => ({
            voter: p.id,
            choice:
                accusations[Math.floor(Math.random() * accusations.length)],
        }));

        const allVotes = [
            ...votesByOthers,
            { voter: you.id, choice: yourVote },
        ];

        const tally = {};
        allVotes.forEach((v) => {
            tally[v.choice] = (tally[v.choice] || 0) + 1;
        });

        // Meistgewählter Angeklagter stirbt
        let maxTarget = accusations[0];
        let maxVotes = tally[maxTarget] || 0;
        accusations.forEach((id) => {
            const v = tally[id] || 0;
            if (v > maxVotes) {
                maxVotes = v;
                maxTarget = id;
            }
        });

        if (maxVotes > 0) {
            killPlayer(maxTarget);
        }

        // Reset Day-State und weiter zur Nacht (falls niemand gewonnen hat)
        setAccusations([]);
        setYourVote(null);
        setIsReady(false);
        if (!computeWinner(players)) {
            setPhase("NIGHT");
        }
    };

    // --- Nacht: Werwolf kill ---------------------------------------------------

    const isYouWerewolf = you?.role === "WEREWOLF";

    const handleConfirmNightKill = () => {
        if (!nightTargetId || result) return;
        killPlayer(nightTargetId);

        // Zurück zum Tag, Ready zurücksetzen
        setNightTargetId(null);
        setIsReady(false);

        if (!computeWinner(players)) {
            setPhase("DAY");
        }
    };

    // --- UI --------------------------------------------------------------------

    const phaseLabel =
        phase === "DAY" ? "Day – Diskussion & Voting" : "Night – Werwölfe sind aktiv";

    const roleDescription =
        you?.role === "WEREWOLF"
            ? "Du bist ein Werwolf. In der Nacht darfst du einen Spieler auswählen, den du tötest."
            : "Du bist ein Villager. Am Tag kannst du Spieler anklagen und für eine Hinrichtung abstimmen.";

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
                    {/* Header: Code + Leave */}
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

                    {/* Phase + Ready-Button */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <div className="small" style={{ color: "#9ca3af" }}>
                                Current phase
                            </div>
                            <div className="fw-bold">{phaseLabel}</div>
                        </div>
                        {!result && (
                            <button
                                type="button"
                                className={`btn btn-sm ${
                                    isReady ? "btn-success" : "btn-outline-success"
                                }`}
                                onClick={handleReadyClick}
                            >
                                {isReady ? "Ready ✔" : "Ready"}
                            </button>
                        )}
                    </div>

                    {/* Rollen-Info */}
                    {you && (
                        <div className="alert alert-dark border-danger small mb-3">
                            Du bist{" "}
                            <strong>
                                {you.role === "WEREWOLF" ? "Werwolf" : "Villager"}
                            </strong>
                            . {roleDescription}
                        </div>
                    )}

                    {/* Ergebnis-Screen */}
                    {result ? (
                        <div
                            className="mt-3 p-4"
                            style={{
                                borderRadius: "1rem",
                                border: "1px solid rgba(148,163,184,0.5)",
                                background: "rgba(15,23,42,0.95)",
                            }}
                        >
                            <h3 className="h4 mb-2">
                                {result.winner === "VILLAGERS"
                                    ? "Villagers gewinnen!"
                                    : "Werwölfe gewinnen!"}
                            </h3>
                            <p className="mb-1">
                                Du warst{" "}
                                <strong>
                                    {you?.role === "WEREWOLF" ? "Werwolf" : "Villager"}
                                </strong>
                                .
                            </p>
                            <p className="mb-3">
                                Du hast{" "}
                                <strong>{result.youWon ? "gewonnen 🎉" : "verloren 💀"}</strong>.
                            </p>
                            <button
                                type="button"
                                className="btn btn-outline-info btn-sm me-2"
                                onClick={() => navigate("/leaderboard")}
                            >
                                View leaderboard
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-light btn-sm"
                                onClick={leaveGame}
                            >
                                Back to home
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Spielfeld: Links Spieler, rechts Phase-spezifische Aktionen */}

                            <div className="row g-4 mt-2">
                                {/* Spieler-Liste */}
                                <div className="col-lg-6">
                                    <h5 className="mb-2" style={{ color: "#f9fafb" }}>
                                        Players
                                    </h5>
                                    <ul className="list-group list-group-flush bg-transparent">
                                        {players.map((p) => (
                                            <li
                                                key={p.id}
                                                className="list-group-item bg-transparent text-light d-flex justify-content-between align-items-center"
                                                style={{
                                                    background: "rgba(15,23,42,0.75)",
                                                    borderColor: "rgba(55,65,81,0.6)",
                                                }}
                                            >
                                                <div>
                                                    {p.name}
                                                    {p.isYou && (
                                                        <span className="badge bg-info ms-2">You</span>
                                                    )}
                                                    {!p.alive && (
                                                        <span className="badge bg-secondary ms-2">
                              Dead
                            </span>
                                                    )}
                                                </div>
                                                <div className="small" style={{ color: "#9ca3af" }}>
                                                    {p.alive ? "Alive" : "Dead"}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="small mt-2" style={{ color: "#9ca3af" }}>
                                        Alive – Villagers: {aliveVillagers.length} | Werewolves:{" "}
                                        {aliveWolves.length}
                                    </div>
                                </div>

                                {/* Aktionen je nach Phase */}
                                <div className="col-lg-6">
                                    {phase === "DAY" ? (
                                        <>
                                            <h5 className="mb-2" style={{ color: "#f9fafb" }}>
                                                Day actions
                                            </h5>
                                            <p className="small" style={{ color: "#9ca3af" }}>
                                                Du kannst bis zu <strong>2 Spieler anklagen</strong>.
                                                Danach stimmst du ab. Der meistgewählte Angeklagte wird
                                                getötet, dann beginnt die Nacht.
                                            </p>

                                            {/* Anklagen */}
                                            {canAccuseMore && (
                                                <div className="mb-2 small">
                                                    <strong>Anklagen:</strong>{" "}
                                                    <span style={{ color: "#9ca3af" }}>
                            Wähle einen Spieler (max. 2 insgesamt).
                          </span>
                                                </div>
                                            )}

                                            {canAccuseMore && (
                                                <div className="d-flex flex-wrap gap-2 mb-3">
                                                    {alivePlayers
                                                        .filter((p) => p.isYou !== true) // sich selbst nicht anklagen
                                                        .map((p) => (
                                                            <button
                                                                key={p.id}
                                                                type="button"
                                                                className="btn btn-outline-danger btn-sm"
                                                                disabled={accusations.includes(p.id)}
                                                                onClick={() => handleAccuse(p.id)}
                                                            >
                                                                Accuse {p.name}
                                                            </button>
                                                        ))}
                                                </div>
                                            )}

                                            {/* Liste der Angeklagten */}
                                            {accusedPlayers.length > 0 && (
                                                <div className="mb-3 small">
                                                    <strong>Angeklagt:</strong>{" "}
                                                    {accusedPlayers
                                                        .map((p) => p.name)
                                                        .join(", ")}
                                                </div>
                                            )}

                                            {/* Voting */}
                                            {accusedPlayers.length > 0 && (
                                                <div className="mb-3">
                                                    <div className="small mb-1">
                                                        <strong>Deine Stimme:</strong>
                                                    </div>
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {accusedPlayers.map((p) => (
                                                            <button
                                                                key={p.id}
                                                                type="button"
                                                                className={`btn btn-sm ${
                                                                    yourVote === p.id
                                                                        ? "btn-warning"
                                                                        : "btn-outline-warning"
                                                                }`}
                                                                onClick={() => setYourVote(p.id)}
                                                            >
                                                                Vote {p.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary btn-sm mt-3"
                                                        disabled={!yourVote}
                                                        onClick={handleSubmitVote}
                                                    >
                                                        Submit vote
                                                    </button>
                                                </div>
                                            )}

                                            {accusedPlayers.length === 0 && !canAccuseMore && (
                                                <p className="small text-warning mb-0">
                                                    Zu wenige Spieler, um noch eine Hinrichtung
                                                    durchzuführen.
                                                </p>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <h5 className="mb-2" style={{ color: "#f9fafb" }}>
                                                Night actions
                                            </h5>
                                            {isYouWerewolf ? (
                                                <>
                                                    <p className="small" style={{ color: "#9ca3af" }}>
                                                        Du bist Werwolf. Wähle ein{" "}
                                                        <strong>lebendes Ziel</strong> (kein Werwolf), das
                                                        in dieser Nacht sterben soll.
                                                    </p>
                                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                                        {alivePlayers
                                                            .filter(
                                                                (p) =>
                                                                    p.id !== you.id && p.role === "VILLAGER"
                                                            )
                                                            .map((p) => (
                                                                <button
                                                                    key={p.id}
                                                                    type="button"
                                                                    className={`btn btn-sm ${
                                                                        nightTargetId === p.id
                                                                            ? "btn-danger"
                                                                            : "btn-outline-danger"
                                                                    }`}
                                                                    onClick={() => setNightTargetId(p.id)}
                                                                >
                                                                    {p.name}
                                                                </button>
                                                            ))}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-warning btn-sm"
                                                        disabled={!nightTargetId}
                                                        onClick={handleConfirmNightKill}
                                                    >
                                                        Confirm kill
                                                    </button>
                                                </>
                                            ) : (
                                                <p className="small" style={{ color: "#9ca3af" }}>
                                                    Es ist Nacht. Du bist kein Werwolf – du kannst nichts
                                                    tun und wartest, bis der neue Tag beginnt.
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
