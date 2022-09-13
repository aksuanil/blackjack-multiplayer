import express from 'express';
import http from 'http';
import debounce from 'just-debounce-it';
import { Server } from 'socket.io';
import { changePhase, clearRound, deleteRoom, disconnectWithSocketId, endTurnLoop, findLobby, getActiveSeats, getLobbyData, getSeatedSeats, initializeLobby, openTableCard, skipTurn, startTurnLoop } from './controllers/lobby.controller.js';
import { addBet, addCard, addCash, addStartingCards, clearCards, getSeated, getUnseated, setBusted, setPlaying } from './controllers/seat.controller.js';
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
    let username = 'guest';

    socket.on('joinRoom', async (lobbyId, isCreated, newUsername, cb) => {
        username = newUsername;
        const res = await findLobby(lobbyId);
        if (isCreated && !res) {
            await initializeLobby(lobbyId);
            console.log('room created: ' + lobbyId)
            await socket.join(lobbyId);
        }
        else if (res) {
            await socket.join(lobbyId);
            console.log('socket joined: ' + lobbyId)
        }
        else {
            // res 'room not exist'
            return console.log('room is not exist')
        }
        const result = await getLobbyData(lobbyId);
        socket.roomId = Array.from(socket.rooms)[1]
        cb(result);
        console.log(lobbyId + ' lobby data sent');

        if (newUsername) {
            emitSystemMessage(lobbyId, `${newUsername} has connected`, 'orange')
        }
        // console.log(`a user connected to ${Array.from(socket.rooms)[1]}`);
    });

    // socket.on("onConnect", async (lobbyId, newUsername, cb) => {
    //     username = newUsername;
    //     const result = await getLobbyData(lobbyId);
    //     console.log(lobbyId + ' lobby data sent')
    //     cb(result);
    //     if (newUsername) {
    //         emitSystemMessage(lobbyId, `${newUsername} connected`)
    //     }
    // }
    // )
    socket.on('disconnect', async function () {
        await disconnectWithSocketId(socket.roomId, socket.id);
        const res = await getSeatedSeats(socket.roomId)
        if (!res) {
            deleteRoom(socket.roomId);
        }
        console.log('disconnected ' + socket.id + ' from ' + socket.roomId)
        io.sockets.in(socket.roomId).emit("update", await getLobbyData(socket.roomId));
        emitSystemMessage(socket.roomId, `${username} disconnected`, 'red')
    });

    const emitSystemMessage = (lobbyId, message, color) => {
        io.sockets.in(lobbyId).emit("systemMessage", message, color);
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
                const result = await getSeatedSeats(lobbyId);
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
            case "pass":
                //skip turn to next player
                //arrange the counter
                io.sockets.in(lobbyId).emit("update", await skipTurn(lobbyId, data.seatId));
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
        await clearRound(lobbyId);
        let seatedSeats = await getSeatedSeats(lobbyId);
        seatedSeats.seats.forEach(async item => {
            await setPlaying(lobbyId, item.id);
        });
        //set playing status
        if (seatedSeats) {
            for (let i = 0; i < seatedSeats.seats.length; i++) {
                await addBet(lobbyId, seatedSeats.seats[i].id, 10);
            }
            io.sockets.in(lobbyId).emit("update", await changePhase(lobbyId, 'BETTING'));
            setIntervalById(lobbyId + '_startBetting', 10, lobbyId);
            debounceById(lobbyId, async () => {
                startPlayingPhase(lobbyId, seatedSeats);
            }, 11000);
        }
    }
    const startPlayingPhase = async (lobbyId, seatedSeats) => {
        if (seatedSeats) {
            await changePhase(lobbyId, 'PLAYING')
            await openTableCard(lobbyId)
            io.sockets.in(lobbyId).emit("update", await addStartingCards(lobbyId, seatedSeats));

            for (let i = 0; i < seatedSeats.seats.length; i++) {
                setTimeout(() => {
                    setIntervalById(lobbyId + '_turnLoop' + i, 10, lobbyId);
                }, (i * 10500));
                debounceById(lobbyId + '_turnLoop_' + seatedSeats.seats[i].id, async () => {
                    const res = await startTurnLoop(lobbyId, i, seatedSeats.seats[i].id)
                    io.sockets.in(lobbyId).emit("update", res.value);
                }, i * 11000);

                if (i === (seatedSeats.seats.length - 1)) {
                    // setIntervalById(lobbyId + '_finishRound', (i * 10) + 10, lobbyId);
                    debounceById(lobbyId + '_finishRound', async () => {
                        await finishRound(lobbyId);
                        setIntervalById(lobbyId + '_startIntermission', 8, lobbyId);
                        debounceById(lobbyId + '_startIntermission', async () => {
                            await startIntermission(lobbyId);
                            setIntervalById(lobbyId + '_startRound', 7, lobbyId);
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
