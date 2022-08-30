import React, { createContext, useEffect, useContext, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(undefined);

const socket = io("http://localhost:8080");

function SocketProvider({ children }) {

    const [lobbyData, setLobbyData] = useState({
        lobbyId: "",
        phase: "",
        seats: [
            { id: 0, name: "", status: false, cash: 200, cards: [], isTurn: false },
            { id: 1, name: "", status: false, cash: 200, cards: [], isTurn: false },
            { id: 2, name: "", status: false, cash: 200, cards: [], isTurn: false },
            { id: 3, name: "", status: false, cash: 200, cards: [], isTurn: false },
        ],
        table: {
            deck: [22, 22  ],
            tableCards: [22, 22  ],
            currentPlayer: 0,
            currentBet: 0,
            currentBetPlayer: 0,
            currentBetPlayerName: ""
        }
    });

    const emitAction = (action, lobbyId, data) => {
        socket.emit("action", action, lobbyId, data);
    }
    const onConnect = () => {
        socket.emit("onConnect", 'TEST9', (serverData) => {
            setLobbyData(serverData);
        });
    }
    const onUpdate = () => {
        socket.on("update", (serverData) => {
            setLobbyData(serverData);
        });
    }

    return (
        <SocketContext.Provider value={{ emitAction, onConnect, onUpdate, lobbyData, socket }}>
            {children}
        </SocketContext.Provider>
    );
}

export { SocketProvider, SocketContext };