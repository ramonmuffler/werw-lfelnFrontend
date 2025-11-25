
type PlayerListProps = {
    players: string[];
    onRemovePlayer: (name: string) => void;
};

export const PlayerList: React.FC<PlayerListProps> = ({
                                                          players,
                                                          onRemovePlayer,
                                                      }) => {
    if (players.length === 0) {
        return (
            <div
                style={{
                    marginBottom: "1rem",
                    fontSize: "0.85rem",
                    color: "#666",
                }}
            >
                Noch keine Spieler hinzugefügt.
            </div>
        );
    }

    return (
        <ul
            style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 1rem 0",
                maxHeight: "180px",
                overflowY: "auto",
            }}
        >
            {players.map((p) => (
                <li
                    key={p}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.25rem 0",
                        borderBottom: "1px solid rgba(0,0,0,0.05)",
                    }}
                >
                    <span>{p}</span>
                    <button
                        type="button"
                        onClick={() => onRemovePlayer(p)}
                        style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                        }}
                    >
                        ✕
                    </button>
                </li>
            ))}
        </ul>
    );
};
