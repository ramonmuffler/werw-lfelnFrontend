import { useState } from "react";

type StartGameWizardProps = {
    open: boolean;
    playersCount: number;
    onCancel: () => void;
    onConfirm: (werewolfCount: 1 | 2) => void;
};

export const StartGameWizard: React.FC<StartGameWizardProps> = ({
    open,
    playersCount,
    onCancel,
    onConfirm,
}) => {
    const [werewolfCount, setWerewolfCount] = useState<1 | 2>(1);

    if (!open) return null;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "380px",
                    background: "white",
                    borderRadius: "12px",
                    padding: "1.25rem 1.5rem",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    fontFamily:
                        "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        marginBottom: "0.75rem",
                        fontSize: "1.15rem",
                    }}
                >
                    Spiel wirklich starten?
                </h2>

                <p
                    style={{
                        marginTop: 0,
                        marginBottom: "0.75rem",
                        fontSize: "0.95rem",
                    }}
                >
                    Es sind aktuell <strong>{playersCount}</strong> Spieler in
                    der Lobby. Nach dem Start können keine weiteren Spieler
                    mehr hinzugefügt werden.
                </p>

                <div
                    style={{
                        marginBottom: "0.75rem",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        background: "#f9fafb",
                    }}
                >
                    <div
                        style={{
                            marginBottom: "0.4rem",
                            fontWeight: 500,
                            fontSize: "0.95rem",
                        }}
                    >
                        Anzahl Werwölfe wählen
                    </div>
                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            fontSize: "0.9rem",
                            marginBottom: "0.25rem",
                        }}
                    >
                        <input
                            type="radio"
                            name="werewolfCount"
                            value="1"
                            checked={werewolfCount === 1}
                            onChange={() => setWerewolfCount(1)}
                        />
                        1 Werwolf
                    </label>
                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            fontSize: "0.9rem",
                        }}
                    >
                        <input
                            type="radio"
                            name="werewolfCount"
                            value="2"
                            checked={werewolfCount === 2}
                            onChange={() => setWerewolfCount(2)}
                        />
                        2 Werwölfe
                    </label>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "0.5rem",
                        marginTop: "0.5rem",
                    }}
                >
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            padding: "0.45rem 0.9rem",
                            borderRadius: "8px",
                            border: "1px solid #d1d5db",
                            background: "white",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                        }}
                    >
                        Abbrechen
                    </button>
                    <button
                        type="button"
                        onClick={() => onConfirm(werewolfCount)}
                        style={{
                            padding: "0.45rem 0.9rem",
                            borderRadius: "8px",
                            border: "none",
                            background: "#2563eb",
                            color: "white",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            fontWeight: 600,
                        }}
                    >
                        Spiel starten
                    </button>
                </div>
            </div>
        </div>
    );
};
