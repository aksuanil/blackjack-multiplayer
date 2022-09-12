import express from 'express';
import http from 'http';
import debounce from 'just-debounce-it';
import { Server } from 'socket.io';
import { changePhase, clearRound, deleteRoom, disconnectWithSocketId, endTurnLoop, findLobby, getActiveSeats, getLobbyData, initializeLobby, openTableCard, startTurnLoop } from './controllers/lobby.controller.js';
import { addBet, addCard, addCash, addStartingCards, clearCards, getSeated, getUnseated, setBusted } from './controllers/seat.controller.js';
import { cardValues } from './helpers/cardHelpers.js';

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
});

io.on('connection', (socket) => {
    console.log('connectedSocket')
    socket.on('joinRoom', async (lobbyId, isCreated, cb) => {
        const res = await findLobby(lobbyId);
        if (isCreated && !res) {
            await initializeLobby(lobbyId);
            await socket.join(lobbyId);
            console.log('room created: ' + lobbyId)
        }
        else if (res) {
            await socket.join(lobbyId);
            console.log('socket joined: ' + lobbyId)
        }
        else {
            // res 'room not exist'
            return console.log('room is not exist')
        }
        socket.roomId = Array.from(socket.rooms)[1]
        cb(false)
        return console.log(`a user connected to ${Array.from(socket.rooms)[1]}`);
    });

    let username = 'guest';
    socket.on("onConnect", async (lobbyId, newUsername, cb) => {
        username = newUsername;
        const result = await getLobbyData(lobbyId);
        console.log(lobbyId + ' lobby data sent')
        cb(result);
        if (newUsername) {
            emitSystemMessage(lobbyId, `${newUsername} connected`)
        }
    }
    )
    socket.on('disconnect', async function () {
        await disconnectWithSocketId(socket.roomId, socket.id);
        const res = await getActiveSeats(socket.roomId)
        if (!res) {
            deleteRoom(socket.roomId);
        }
        console.log('disconnected ' + socket.id + ' from ' + socket.roomId)
        io.sockets.in(socket.roomId).emit("update", await getLobbyData(socket.roomId));
        emitSystemMessage(socket.roomId, `${username} disconnected`)
    });

    const emitSystemMessage = (lobbyId, message) => {
        io.sockets.in(lobbyId).emit("systemMessage", message);
    }

    socket.on('sendMessage', (message, lobbyId) => {
        console.log(message, lobbyId)
        socket.broadcast.to(lobbyId).emit('receiveMessage', message, username);
    })
    socket.on("action", async (action, lobbyId, data) => {
        switch (action) {
            case "initializeLobby":
                initializeLobby(lobbyId);
                break;
            case "getSeated":
                io.sockets.in(lobbyId).emit("update", await getSeated(lobbyId, data.seatId, data.socketId, username));
                const result = await getActiveSeats(lobbyId);
                if (result?.seats?.length === 1) {
                    setIntervalById(lobbyId + '_startRound1', 5, lobbyId);
                    io.sockets.in(lobbyId).emit("update", await changePhase(lobbyId, 'INTERMISSION'));
                    setTimeout(async () => {
                        startRound(lobbyId);
                    }, 5500)
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

    const intervalPool = {};
    const setIntervalById = (id, counter, lobbyId) => {
        // if (!intervalPool[id]) {
        counter++;
        intervalPool[id] = setInterval(function () {
            counter--
            io.sockets.in(lobbyId).emit('countdown', counter);
            if (counter <= 0) {
                clearInterval(intervalPool[id]);
            }
        }, 1000)
        // }
    }

    const debouncePool = {};
    function debounceById(id, func, delay) {
        debouncePool[id] = debounce(() => {
            func();
        }, delay);
        debouncePool[id]();
    }

    const startRound = async (lobbyId) => {
        await clearRound(lobbyId)
        let activeSeats = await getActiveSeats(lobbyId);
        if (activeSeats) {
            for (let i = 0; i < activeSeats.seats.length; i++) {
                await addBet(lobbyId, activeSeats.seats[i].id, 10);
            }
            io.sockets.in(lobbyId).emit("update", await changePhase(lobbyId, 'BETTING'));
            debounceById(lobbyId, async () => {
                startPlayingPhase(lobbyId, activeSeats);
            }, 11000);
        }
    }
    const startPlayingPhase = async (lobbyId, activeSeats) => {
        if (activeSeats) {
            await changePhase(lobbyId, 'PLAYING')
            await openTableCard(lobbyId)
            io.sockets.in(lobbyId).emit("update", await addStartingCards(lobbyId, activeSeats));

            for (let i = 0; i < activeSeats.seats.length; i++) {
                debounceById(lobbyId + '_turnLoop_' + activeSeats.seats[i].id, async () => {
                    const res = await startTurnLoop(lobbyId, i, activeSeats.seats[i].id)
                    io.sockets.in(lobbyId).emit("update", res.value);
                }, i * 11000);

                if (i === (activeSeats.seats.length - 1)) {
                    // setIntervalById(lobbyId + '_finishRound', (i * 10) + 10, lobbyId);
                    debounceById(lobbyId + '_finishRound', async () => {
                        await finishRound(lobbyId);
                        // setIntervalById(lobbyId + '_startIntermission', 8, lobbyId);
                        debounceById(lobbyId + '_startIntermission', async () => {
                            await startIntermission(lobbyId);
                            // setIntervalById(lobbyId + '_startRound', 7, lobbyId);
                            debounceById(lobbyId + '_startRound', () => {
                                startRound(lobbyId);
                            }, 8000);
                        }, 9000);
                    }, (i * 11000) + 11000);
                }
            }
        }
    }
    const finishRound = async (lobbyId) => {
        let response = await openTableCard(lobbyId)
        let totalTable = 0;
        response?.table?.tableCards.forEach(element => {
            totalTable += cardValues[element]
        });
        while (totalTable < 16) {
            totalTable = 0;
            response = await openTableCard(lobbyId);
            response?.table?.tableCards.forEach(element => {
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
