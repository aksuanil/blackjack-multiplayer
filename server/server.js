import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { getSeated, getUnseated, addCash, addCard, clearCards, addStartingCards } from './controllers/seat.controller.js';
import { initializeLobby, getLobbyData, openCard, startTurnLoop, getActiveSeats, endTurnLoop, disconnectWithSocketId, changePhase } from './controllers/lobby.controller.js';

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
});
getUnseated('TEST9', 0)
getUnseated('TEST9', 1)
getUnseated('TEST9', 2)
getUnseated('TEST9', 3)
io.on('connection', (socket) => {
    socket.emit("user-join", "user joined");
    socket.join("TEST9");
    console.log(`a user connected to ${Array.from(socket.rooms)[1]}`);
    socket.roomId = Array.from(socket.rooms)[1]

    socket.on("onConnect", async (lobbyId, cb) => {
        const result = await getLobbyData(lobbyId);
        cb(result);
    }
    )
    socket.on('disconnect', async function () {
        await disconnectWithSocketId(socket.roomId, socket.id)
        io.sockets.in(socket.roomId).emit("update", await getLobbyData(socket.roomId));
    });
    socket.on("action", async (action, lobbyId, data) => {
        switch (action) {
            case "initializeLobby":
                initializeLobby(lobbyId);
                break;
            case "startRound":
                await openCard(lobbyId);
                io.sockets.in(lobbyId).emit("update", await addStartingCards(lobbyId));
                break;
            case "getSeated":
                io.sockets.in(lobbyId).emit("update", await getSeated(lobbyId, data.seatId, data.socketId, data.name));
                break;
            case "getUnseated":
                io.sockets.in(lobbyId).emit("update", await getUnseated(lobbyId, data.seatId));
                break;
            case "addCash":
                addCash(lobbyId, data.seatId, data.cashAmount);
                break;
            case "addCard":
                io.sockets.in(lobbyId).emit("update", await addCard(lobbyId, data.seatId));
                break;
            case "clearCards":
                clearCards(lobbyId, data.seatId);
                break;
            case "startBetPhase":
                const result = await getActiveSeats(lobbyId);
                if (result) {
                    await changePhase(lobbyId, 'betting')
                    for (let i = 0; i < result.seats.length; i++) {
                        setTimeout(async () => {
                            const res = await startTurnLoop('TEST9', i, result.seats[i].id)
                            io.sockets.in(lobbyId).emit("update", res.value);
                        }, i * 10000)
                        if (i === (result.seats.length - 1))
                            setTimeout(async () => {
                                const res = await endTurnLoop(lobbyId)
                                io.sockets.in(lobbyId).emit("update", res.value);
                                startPlayingPhase(lobbyId, result)
                            }, (i * 10000) + 10000)
                    }
                }
                break;
            default:
                break;
        }
    })
    const startPlayingPhase = async (lobbyId, activeSeats) => {
        if (activeSeats) {
            await changePhase(lobbyId, 'playing')
            for (let i = 0; i < activeSeats.seats.length; i++) {
                setTimeout(async () => {
                    const res = await startTurnLoop('TEST9', i, activeSeats.seats[i].id)
                    io.sockets.in(lobbyId).emit("update", res.value);
                }, i * 10000)
                if (i === (activeSeats.seats.length - 1))
                    setTimeout(async () => {
                        const res = await endTurnLoop(lobbyId)
                        io.sockets.in(lobbyId).emit("update", res.value);
                    }, (i * 10000) + 10000)
            }
        }
    }
});

httpServer.listen(8080, () => {
    console.log('listening on *:8080');
});
