import  { useState } from "react";
import { LobbyCard } from "../wcomponents/lobby/LobbyCards";
import { AddPlayerForm } from "../wcomponents/lobby/AddPlayerForm";
import { PlayerList } from "../wcomponents/lobby/PlayerList";
import { CreateLobbyButton } from "../wcomponents/lobby/CreateLobbyButton";
import {StartGameWizard} from "../wcomponents/lobby/StartGameWizard";
import {useNavigate} from "react-router-dom";

export type LobbyInfo = {
    createdAt: Date;
    players: string[];
    werewolfCount: 1 | 2;
};

export type LobbyProps = {
    onLobbyCreated?: (info: LobbyInfo) => void;
};

const Lobby: React.FC<LobbyProps> = ({ onLobbyCreated }) => {
    const navigate = useNavigate();

    const [players, setPlayers] = useState<string[]>([]);
    const [isWizardOpen, setIsWizardOpen] = useState(false);


    const handleAddPlayer = (name: string) => {
        setPlayers((prev) => [...prev, name]);
    };

    const handleRemovePlayer = (name: string) => {
        setPlayers((prev) => prev.filter((p) => p !== name));
    };

    // Klick auf „Lobby erstellen“ → nur Wizard öffnen, noch KEIN Code generieren
    const handleOpenWizard = () => {
        setIsWizardOpen(true);
    };

    // Wizard bestätigt „Spiel starten“
    const handleConfirmStartGame = (werewolfCount: 1 | 2) => {
        const info: LobbyInfo = {
            createdAt: new Date(),
            players,
            werewolfCount,
        };

        setIsWizardOpen(false);

        if (onLobbyCreated) {
            onLobbyCreated(info); // Parent kann hier direkt auf <Game /> wechseln
        }
        navigate("/game", { state: info });
    };

    const handleCancelWizard = () => {
        setIsWizardOpen(false);
    };

    const canCreateLobby = players.length >= 5;

    return (
        <LobbyCard title="Werwölfe Lobby">
            <AddPlayerForm
                existingPlayers={players}
                onPlayerAdded={handleAddPlayer}
            />

            <PlayerList players={players} onRemovePlayer={handleRemovePlayer} />

            <CreateLobbyButton
                disabled={!canCreateLobby}
                onCreate={handleOpenWizard}
            />

            <StartGameWizard
                open={isWizardOpen}
                playersCount={players.length}
                onCancel={handleCancelWizard}
                onConfirm={handleConfirmStartGame}
            />
        </LobbyCard>
    );
};

export default Lobby;