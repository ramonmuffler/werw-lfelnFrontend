import {useState} from "react";

type AddPlayerFormProps = {
    existingPlayers: string[];
    onPlayerAdded: (name: string) => void;
};

export const AddPlayerForm: React.FC<AddPlayerFormProps> = ({
                                                                existingPlayers,
                                                                onPlayerAdded,
                                                            }) => {
    const [newPlayerName, setNewPlayerName] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleAddPlayer = () => {
        const trimmed = newPlayerName.trim();
        if (!trimmed) return;

        const exists = existingPlayers.some(
            (p) => p.toLowerCase() === trimmed.toLowerCase()
        );
        if (exists) {
            setError(`Spieler "${trimmed}" ist bereits in der Liste.`);
            return;
        }

        onPlayerAdded(trimmed);
        setNewPlayerName("");
        setError(null);
    };

    return (
        <div
            style={{
                marginBottom: "1rem",
                padding: "0.75rem",
                borderRadius: "10px",
                backgroundColor: "#fafafa",
            }}
        >
            <div
                style={{
                    marginBottom: "0.5rem",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                }}
            >
                Spieler zur Lobby hinzufügen
            </div>

            <div
                style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                }}
            >
                <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    placeholder="Spielername"
                    style={{
                        flex: 1,
                        padding: "0.4rem 0.6rem",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        outline: "none",
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddPlayer();
                        }
                    }}
                />
                <button
                    type="button"
                    onClick={handleAddPlayer}
                    style={{
                        padding: "0.4rem 0.75rem",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 500,
                        background: "#22c55e",
                        color: "white",
                        whiteSpace: "nowrap",
                    }}
                >
                    Hinzufügen
                </button>
            </div>

            {error && (
                <div
                    style={{
                        color: "#b00020",
                        fontSize: "0.85rem",
                    }}
                >
                    {error}
                </div>
            )}
        </div>
    );
};
