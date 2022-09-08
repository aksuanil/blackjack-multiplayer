import React, { createContext, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(undefined);

const socket = io("http://localhost:8080");

function SocketProvider({ children }) {
    const [countdown, setCountdown] = useState();
    const [lobbyData, setLobbyData] = useState({
        lobbyId: "",
        phase: "",
        seats: [
            { id: 0, name: "", status: false, cash: 200, cards: [], isTurn: false, currentBet: 0, isBusted: false },
            { id: 1, name: "", status: false, cash: 200, cards: [], isTurn: false, currentBet: 0, isBusted: false },
            { id: 2, name: "", status: false, cash: 200, cards: [], isTurn: false, currentBet: 0, isBusted: false },
            { id: 3, name: "", status: false, cash: 200, cards: [], isTurn: false, currentBet: 0, isBusted: false },
        ],
        table: {
            deck: [0, 0],
            tableCards: [0, 0],
            currentPlayer: 0,
            currentBet: 0,
            currentBetPlayer: 0,
            currentBetPlayerName: ""
        }
    });

    socket.on("countdown", (serverData) => {
        setCountdown(serverData);
    });

    const emitAction = (action, lobbyId, data) => {
        socket.emit("action", action, lobbyId, data);
    }
    const onConnect = (lobbyId) => {
        socket.emit("onConnect", lobbyId, (serverData) => {
            setLobbyData(serverData);
        });
    }
    const onUpdate = () => {
        socket.on("update", (serverData) => {
            setLobbyData(serverData);
        });
    }

    return (
        <SocketContext.Provider value={{ emitAction, onConnect, onUpdate, lobbyData, socket, countdown }}>
            {children}
        </SocketContext.Provider>
    );
}

export { SocketProvider, SocketContext };

