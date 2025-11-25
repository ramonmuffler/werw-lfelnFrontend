import { useLocation } from "react-router-dom";
import type { LobbyInfo } from "../wpages/CreateLobby";
import { useMemo } from "react";

type Role = "werewolf" | "hunter" | "seer" | "villager";

type PlayerWithRole = {
    name: string;
    role: Role;
    alive: boolean;
};

const shuffle = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

const GameSetup: React.FC = () => {
    const location = useLocation();
    const lobby = location.state as LobbyInfo;

    // Rollen generieren
    const playersWithRoles = useMemo<PlayerWithRole[]>(() => {
        const roles: Role[] = [];

        // Anzahl Werwölfe laut Lobby-Einstellung
        for (let i = 0; i < lobby.werewolfCount; i++) {
            roles.push("werewolf");
        }

        // 1 Jäger, 1 Seher/in
        roles.push("hunter");
        roles.push("seer");

        // Der Rest sind Villager
        const rest = lobby.players.length - roles.length;
        for (let i = 0; i < rest; i++) {
            roles.push("villager");
        }

        // Shuffle für zufällige Rollenverteilung
        const shuffledRoles = shuffle(roles);
        const shuffledPlayers = shuffle(lobby.players);

        // Kombinieren: Player + Role
        return shuffledPlayers.map((name, index) => ({
            name,
            role: shuffledRoles[index],
            alive: true,
        }));
    }, [lobby]);

    console.log("Generated player roles:", playersWithRoles);

    return (
        <div>
            <h1>Game Setup</h1>

            <h2>Spieler & Rollen</h2>
            <ul>
                {playersWithRoles.map((p) => (
                    <li key={p.name}>
                        {p.name} — <strong>{p.role}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GameSetup;
