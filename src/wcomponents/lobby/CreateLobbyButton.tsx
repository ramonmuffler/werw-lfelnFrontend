type CreateLobbyButtonProps = {
    disabled: boolean;
    onCreate: () => void;
};

export const CreateLobbyButton: React.FC<CreateLobbyButtonProps> = ({
                                                                        disabled,
                                                                        onCreate,
                                                                    }) => {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onCreate}
            style={{
                width: "100%",
                padding: "0.6rem 0.75rem",
                borderRadius: "8px",
                border: "none",
                cursor: disabled ? "not-allowed" : "pointer",
                fontWeight: 600,
                fontSize: "1rem",
                background: disabled ? "#9ca3af" : "#2563eb",
                color: "white",
                opacity: disabled ? 0.7 : 1,
                transition: "0.2s",
                marginTop: "0.25rem",
            }}
        >
            Lobby erstellen (mind. 5 Spieler)
        </button>
    );
};