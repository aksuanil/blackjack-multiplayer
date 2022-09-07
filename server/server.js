import express from 'express';
import http from 'http';
import debounce from 'just-debounce-it';
import { Server } from 'socket.io';
import { changePhase, clearRound, deleteRoom, disconnectWithSocketId, endTurnLoop, getActiveSeats, getLobbyData, initializeLobby, openTableCard, startTurnLoop } from './controllers/lobby.controller.js';
import { addBet, addCard, addCash, addStartingCards, clearCards, getSeated, getUnseated, setBusted } from './controllers/seat.controller.js';
import { cardValues } from './helpers/cardHelpers.js';

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
});
getUnseated("TEST9", 0)
getUnseated("TEST9", 1)
getUnseated("TEST9", 2)
getUnseated("TEST9", 3)
await changePhase("TEST9", 'NOT_STARTED')
await clearRound("TEST9")

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
        await disconnectWithSocketId(socket.roomId, socket.id);
        const res = await getActiveSeats(socket.roomId)
        if (!res) {
            // deleteRoom(socket.roomId);
        }
        io.sockets.in(socket.roomId).emit("update", await getLobbyData(socket.roomId));
    });
    socket.on("action", async (action, lobbyId, data) => {
        switch (action) {
            case "initializeLobby":
                initializeLobby(lobbyId);
                break;
            case "getSeated":
                io.sockets.in(lobbyId).emit("update", await getSeated(lobbyId, data.seatId, data.socketId, data.name));
                const result = await getActiveSeats(lobbyId);
                if (result.seats.length === 1) {
                    io.sockets.in(lobbyId).emit("update", await changePhase(lobbyId, 'INTERMISSION'));
                    setTimeout(async () => {
                        startRound(lobbyId);
                    }, 5000)
                }
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
                io.sockets.in(lobbyId).emit("update", await setBusted(lobbyId, data.seatId, data.isBusted));
                break;
            case "startRound":
                await startRound(lobbyId);
                break;
            default:
                break;
        }
    })

    const debouncePool = {};
    function debounceById(id, func, delay) {
        if (!debouncePool[id]) {
            debouncePool[id] = debounce(() => {
                func();
            }, delay);
        }
        debouncePool[id]();
    }

    const startRound = async (lobbyId) => {
        await clearRound(lobbyId)
        const activeSeats = await getActiveSeats(lobbyId);
        if (activeSeats) {
            for (let i = 0; i < activeSeats.seats.length; i++) {
                await addBet(lobbyId, activeSeats.seats[i].id, 10);
            }
            io.sockets.in(lobbyId).emit("update", await changePhase(lobbyId, 'BETTING'));

            debounceById(lobbyId, async () => {
                startPlayingPhase(lobbyId, activeSeats);
            }, 10000);

            // setTimeout(async () => {
            //     await changePhase(lobbyId, 'PLAYING');
            //     startPlayingPhase(lobbyId, activeSeats);
            // }, 15000)
        }
    }
    const startPlayingPhase = async (lobbyId, activeSeats) => {
        if (activeSeats) {
            await changePhase(lobbyId, 'PLAYING')
            await openTableCard(lobbyId)
            io.sockets.in(lobbyId).emit("update", await addStartingCards(lobbyId));

            for (let i = 0; i < activeSeats.seats.length; i++) {
                debounceById(lobbyId + '_turnLoop_' + activeSeats.seats[i].id, async () => {
                    const res = await startTurnLoop(lobbyId, i, activeSeats.seats[i].id)
                    io.sockets.in(lobbyId).emit("update", res.value);
                }, i * 10000);

                if (i === (activeSeats.seats.length - 1))
                    debounceById(lobbyId + '_finishRound', async () => {
                        await finishRound(lobbyId);
                        debounceById(lobbyId + '_startIntermission', async () => {
                            await startIntermission(lobbyId);
                        }, 8000);
                        debounceById(lobbyId + '_startRound', () => {
                            startRound(lobbyId);
                        }, 15000);
                        // setTimeout(async () => {
                        //     await startIntermission(lobbyId);
                        // }, 8000)
                        // setTimeout(async () => {
                        //     await startRound(lobbyId);
                        // }, 15000)
                    }, (i * 10000) + 10000);

                // setTimeout(async () => {
                //     await finishRound(lobbyId);
                //     setTimeout(async () => {
                //         await startIntermission(lobbyId);
                //     }, 8000)
                //     setTimeout(async () => {
                //         await startRound(lobbyId);
                //     }, 15000)
                // }, (i * 10000) + 10000)
            }
        }
    }

    const finishRound = async (lobbyId) => {
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
        await changePhase(lobbyId, 'ROUND_END')
        const res = await endTurnLoop(lobbyId)
        io.sockets.in(lobbyId).emit("update", res.value);
    }

    const startIntermission = async (lobbyId) => {
        await clearRound(lobbyId)
        io.sockets.in(lobbyId).emit("update", await changePhase(lobbyId, 'INTERMISSION'));
    }

});

httpServer.listen(8080, () => {
    console.log('listening on *:8080');
});
