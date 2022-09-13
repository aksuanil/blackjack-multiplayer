import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useBeforeRender from "../hooks/useBeforeRender";

const SocketContext = createContext(undefined);

let socket = {};
socket.id = 0;

function SocketProvider({ children }) {
    useBeforeRender(() => {
        socket = io("http://localhost:8080");
        console.log('connect');
    }, [])
    // useEffect(() => {
    //     socket = io("http://localhost:8080");
    //     console.log('connect')
    // }, [])
    const [countdown, setCountdown] = useState();
    const [isLoading, setIsLoading] = useState(false);
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

    const onCountdown = () => {
        socket.on("countdown", (countdown) => {
            countdown === 0 ? setCountdown(' ') : setCountdown(countdown);
        })
    };
    const emitAction = (action, lobbyId, data) => {
        socket.emit("action", action, lobbyId, data);
    }
    const emitJoin = async (lobbyId, isCreated) => {
        setIsLoading(true);
        console.log('emitJoin')
        await socket.emit('joinRoom', lobbyId, isCreated, (data) => {
            // setIsLoading(data)
        })
    }
    const onConnect = async (lobbyId, newUsername) => {
        console.log('onConnect')
        await socket.emit("onConnect", lobbyId, newUsername, (serverData) => {
            setLobbyData(serverData);
        });
        setIsLoading(false);
    }
    const onUpdate = () => {
        socket.on("update", (serverData) => {
            setLobbyData(serverData);
        });
    }

    const emitSendMessage = (message, lobbyId) => {
        socket.emit("sendMessage", message, lobbyId);
    }
    const onReceiveMessage = (appendMessage) => {
        socket.on("receiveMessage", (message) => {
            appendMessage(message)
        });
    }

    return (
        <SocketContext.Provider value={{ emitSendMessage, onReceiveMessage, emitJoin, emitAction, onConnect, onUpdate, lobbyData, socket, countdown, onCountdown, isLoading }}>
            {children}
        </SocketContext.Provider>
    );
}

export { SocketProvider, SocketContext };

