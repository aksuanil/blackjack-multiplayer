import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { changePhase, clearRound, disconnectWithSocketId, endTurnLoop, getActiveSeats, getLobbyData, initializeLobby, openTableCard, startTurnLoop } from './controllers/lobby.controller.js';
import { addBet, addCard, addCash, addStartingCards, clearCards, getSeated, getUnseated, setBusted } from './controllers/seat.controller.js';
import { cardValues } from './helpers/cardHelpers.js';
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
            // case "startRound":
            //     await openCard(lobbyId);
            //     io.sockets.in(lobbyId).emit("update", await addStartingCards(lobbyId));
            //     break;
            case "getSeated":
                io.sockets.in(lobbyId).emit("update", await getSeated(lobbyId, data.seatId, data.socketId, data.name));
                break;
            case "getUnseated":
                io.sockets.in(lobbyId).emit("update", await getUnseated(lobbyId, data.seatId));
                break;
            case "addCash":
                io.sockets.in(lobbyId).emit("update", await addCash(lobbyId, data.seatId, data.cashAmount));
                break;
            case "setBet":
                io.sockets.in(lobbyId).emit("update", await addBet(lobbyId, data.seatId, data.betAmount));
                break;
            case "addCard":
                io.sockets.in(lobbyId).emit("update", await addCard(lobbyId, data.seatId));
                break;
            case "clearCards":
                clearCards(lobbyId, data.seatId);
                break;
            case "setBusted":
                // setBusted(lobbyId, data.seatId, data.isBusted);
                io.sockets.in(lobbyId).emit("update", await setBusted(lobbyId, data.seatId, data.isBusted));
                break;
            case "startRound":
                await clearRound(lobbyId)

                const result = await getActiveSeats(lobbyId);
                if (result) {
                    await changePhase(lobbyId, 'betting')
                    for (let i = 0; i < result.seats.length; i++) {
                        await addBet(lobbyId, result.seats[i].id, 10);
                        setTimeout(async () => {
                            let res = await startTurnLoop('TEST9', i, result.seats[i].id)
                            // if (res.value.seats[i].currentBet === 0) {
                            //     res = await addBet(lobbyId, result.seats[i].id, 10);
                            // }
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
            await openTableCard(lobbyId)
            io.sockets.in(lobbyId).emit("update", await addStartingCards(lobbyId));

            await changePhase(lobbyId, 'playing')
            for (let i = 0; i < activeSeats.seats.length; i++) {
                setTimeout(async () => {
                    const res = await startTurnLoop('TEST9', i, activeSeats.seats[i].id)
                    io.sockets.in(lobbyId).emit("update", res.value);
                }, i * 10000)
                if (i === (activeSeats.seats.length - 1))
                    setTimeout(async () => {
                        let response = await openTableCard(lobbyId)
                        let totalTable = 0;
                        response.table.tableCards.forEach(element => {
                            totalTable += cardValues[element]
                        });
                        while (totalTable < 16) {
                            totalTable = 0;
                            response = await openTableCard(lobbyId);
                            response.table.tableCards.forEach(element => {
                                totalTable += cardValues[element]
                            });
                        }

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
