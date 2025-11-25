export default function Home() {
    return (
        <div className="min-vh-100 d-flex align-items-center bg-dark text-light"
             style={{ height: "100vh", overflow: "hidden" }}>
            <div className="container py-5">
                {/* Hero Section */}
                <div className="row mb-5">
                    <div className="col-lg-7">
                        <h1 className="display-4 fw-bold mb-3">
                            Werewolves <span className="text-danger">Online</span>
                        </h1>
                        <p className="lead text-secondary">
                            The classic party game <span className="text-light">“Werewolves”</span> – now as a
                            web experience. Create a lobby, share the code with your friends, and let the village
                            tremble as night falls.
                        </p>
                        <div className="mt-4 d-flex flex-wrap gap-3">
                            <button className="btn btn-danger btn-lg">
                                Create New Lobby
                            </button>
                        </div>
                    </div>

                    <div className="col-lg-5 mt-4 mt-lg-0">
                        <div
                            className="card bg-gradient border-0 shadow-lg"
                            style={{
                                background:
                                    "radial-gradient(circle at top, #2c2c54 0, #111 55%, #000 100%)",
                            }}
                        >
                            <div className="card-body p-4">
                                <h2 className="h4 text-danger mb-3">Night Over the Village</h2>
                                <p className="mb-2">
                                    Each round shifts between <strong>Night</strong> and{" "}
                                    <strong>Day</strong>.
                                </p>
                                <ul className="small text-secondary mb-0">
                                    <li>The Werewolves secretly choose a victim during the night.</li>
                                    <li>During the day, the village discusses and votes to execute a suspect.</li>
                                    <li>Roles stay hidden – trust no one.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Roles */}
                <div className="row g-4 mb-4">
                    <div className="col-12">
                        <h2 className="h3 fw-bold mb-3">Roles in the Game</h2>
                    </div>

                    <div className="col-md-3">
                        <div className="card bg-dark border border-danger-subtle h-100 shadow-sm">
                            <div className="card-body">
                                <h3 className="h5 text-danger">Werewolves</h3>
                                <p className="small text-secondary mb-0">
                                    They know each other and pick a victim every night.
                                    Goal: Eliminate all villagers without getting exposed.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card bg-dark border border-info h-100 shadow-sm">
                            <div className="card-body">
                                <h3 className="h5 text-info">Seer</h3>
                                <p className="small text-secondary mb-0">
                                    Each night, the Seer can “inspect” a player and learn whether they’re a werewolf —
                                    without revealing their identity.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card bg-dark border border-warning h-100 shadow-sm">
                            <div className="card-body">
                                <h3 className="h5 text-warning">Hunter</h3>
                                <p className="small text-secondary mb-0">
                                    If the Hunter dies, they may take one last shot and eliminate any player of their choice.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card bg-dark border border-secondary h-100 shadow-sm">
                            <div className="card-body">
                                <h3 className="h5 text-light">Villagers</h3>
                                <p className="small text-secondary mb-0">
                                    No special abilities — but the most important skill: logic.
                                    Observe, discuss, trust… or don’t.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Flow */}
                <div className="row g-4 mt-3">
                    <div className="col-lg-6">
                        <h2 className="h4 fw-bold mb-3">How a Game Starts</h2>
                        <ol className="text-secondary small mb-0">
                            <li>Create a lobby and set player count & roles.</li>
                            <li>Share the lobby code with your friends.</li>
                            <li>Everyone secretly receives their role on their own device.</li>
                            <li>The host starts the first night — and chaos begins.</li>
                        </ol>
                    </div>

                    <div className="col-lg-6">
                        <h2 className="h4 fw-bold mb-3">Features of This Web Version</h2>
                        <ul className="text-secondary small mb-0">
                            <li>Automatic role assignment (Werewolves, Hunter, Seer, Villagers).</li>
                            <li>Clear overview of alive / dead players.</li>
                            <li>Guided flow: Night → Day → Voting.</li>
                            <li>No card mixing, no forgetting roles — everything runs online.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
