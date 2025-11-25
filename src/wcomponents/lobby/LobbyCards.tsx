
type LobbyCardProps = {
    title: string;
    children: React.ReactNode;
};

export const LobbyCard: React.FC<LobbyCardProps> = ({ title, children }) => {
    return (
        <div
            style={{
                maxWidth: "450px",
                margin: "2rem auto",
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #ddd",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                fontFamily:
                    "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            }}
        >
            <h1 style={{ marginBottom: "1rem", textAlign: "center" }}>
                {title}
            </h1>
            {children}
        </div>
    );
};
