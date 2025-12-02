import { useEffect, useState } from "react";
import axios from "axios";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8080/api/leaderboard")
      .then((res) => setEntries(res.data))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-5 text-light">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="glass-panel p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h4 mb-0">Leaderboard</h2>
              <span className="small text-secondary">
                Top players by total wins
              </span>
            </div>
            {loading ? (
              <p className="text-secondary mb-0">Loading leaderboard...</p>
            ) : entries.length === 0 ? (
              <p className="text-secondary mb-0">
                No games played yet. Be the first to win a round.
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-borderless table-sm align-middle mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: "3rem" }}>#</th>
                      <th>Player</th>
                      <th className="text-center">Villager W / L</th>
                      <th className="text-center">Werewolf W / L</th>
                      <th className="text-end">Total wins</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((e, idx) => (
                      <tr key={e.id}>
                        <td className="text-secondary">{idx + 1}</td>
                        <td>{e.username}</td>
                        <td className="text-center small">
                          {e.villagerWins} /{" "}
                          <span className="text-secondary">
                            {e.villagerLosses}
                          </span>
                        </td>
                        <td className="text-center small">
                          {e.werewolfWins} /{" "}
                          <span className="text-secondary">
                            {e.werewolfLosses}
                          </span>
                        </td>
                        <td className="text-end fw-semibold text-danger">
                          {e.totalWins}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


