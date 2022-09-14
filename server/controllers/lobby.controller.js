import { db } from '../mongoUtil.js';

const initializeLobby = async (lobbyId) => {
    await db.insertOne({
        lobbyId: lobbyId,
        phase: "NOT_STARTED",
        seats: [
            { id: 0, socketId: "", name: "", cash: 200, cards: [], bet: 0, isTurn: false, isPlaying: false, isSeated: false },
            { id: 1, socketId: "", name: "", cash: 200, cards: [], bet: 0, isTurn: false, isPlaying: false, isSeated: false },
            { id: 2, socketId: "", name: "", cash: 200, cards: [], bet: 0, isTurn: false, isPlaying: false, isSeated: false },
            { id: 3, socketId: "", name: "", cash: 200, cards: [], bet: 0, isTurn: false, isPlaying: false, isSeated: false },
        ],
        table: {
            deck: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
                27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52],
            tableCards: [],
            currentPlayer: 0,
            currentBet: 0,
            currentBetPlayer: 0,
            currentBetPlayerName: ""
        }
    });
};

const getLobbyData = async (lobbyId) => {
    const result = await db.find({ lobbyId: lobbyId }).toArray();
    return result[0]
}

const findLobby = async (lobbyId) => {
    const result = await db.find({ lobbyId: lobbyId }, { lobbyId: 1, _id: 0 }).toArray();
    return result[0]
}

const getActiveSeats = async (lobbyId) => {
    const result = await db.aggregate([
        { $match: { lobbyId: lobbyId, 'seats.isSeated': true, 'seats.isPlaying': true } },
        {
            $project: {
                seats: {
                    $filter: {
                        input: '$seats',
                        as: 'seats',
                        cond: { $eq: ['$$seats.isSeated', true], $eq: ['$$seats.isPlaying', true] }
                    }
                }
            }
        }
    ]).toArray();

    // const result = await db.find({ lobbyId: lobbyId, "seats.isSeated": true }).project({ seats: 1, _id: 0 }).toArray();
    return result[0]
}

const getSeatedSeats = async (lobbyId) => {
    const result = await db.aggregate([
        { $match: { lobbyId: lobbyId, 'seats.isSeated': true } },
        {
            $project: {
                seats: {
                    $filter: {
                        input: '$seats',
                        as: 'seats',
                        cond: { $eq: ['$$seats.isSeated', true] }
                    }
                }
            }
        }
    ]).toArray();

    // const result = await db.find({ lobbyId: lobbyId, "seats.isSeated": true }).project({ seats: 1, _id: 0 }).toArray();
    return result[0]
}

const openTableCard = async (lobbyId) => {
    const res = await db.findOneAndUpdate(
        { lobbyId: lobbyId },
        { $push: { "table.tableCards": Math.floor(Math.random() * 52) } },
        { returnOriginal: false, returnDocument: "after" });
    return (res.value);
}

const startTurnLoop = async (lobbyId, i, id) => {
    await db.updateOne(
        { lobbyId: lobbyId, "seats.id": id },
        {
            $set: {
                "seats.$.isTurn": true
            }
        });
    const res = await db.findOneAndUpdate(
        { lobbyId: lobbyId },
        {
            $set: {
                "seats.$[id].isTurn": false
            }
        },
        {
            arrayFilters: [
                {
                    "id.id": { $ne: id }
                }
            ], returnOriginal: false, returnDocument: "after"
        });
    return res;
}
const skipTurn = async (lobbyId, id) => {
    const activeSeats = await getActiveSeats(lobbyId);
    const lastActiveSeat = activeSeats.seats[activeSeats.seats.length - 1]
    const res = await db.find(
        { lobbyId: lobbyId, "seats.isTurn": true },
        { returnOriginal: false, returnDocument: "after" }).project({ 'seats.$': 1, _id: 0 }).toArray();
    await db.updateOne(
        { lobbyId: lobbyId, "seats.id": id },
        {
            $set: {
                "seats.$.isTurn": false
            }
        });
    const currentTurnSeat = res[0].seats[0];

    if (currentTurnSeat.id === lastActiveSeat.id) {
        const response = await endTurnLoop(lobbyId);
        return response.value;
    }
    else {
        const response = await db.findOneAndUpdate(
            { lobbyId: lobbyId },
            {
                $set: {
                    [`seats.${(currentTurnSeat.id) + 1}.isTurn`]: true
                }
            },
            {
                returnOriginal: false, returnDocument: "after"
            });
        return response.value;
    }
}
const endTurnLoop = async (lobbyId) => {
    const res = await db.findOneAndUpdate(
        { lobbyId: lobbyId },
        {
            $set: {
                "seats.$[id].isTurn": false
            }
        },
        {
            arrayFilters: [
                {
                    "id.id": { $ne: 99 }
                }
            ], returnOriginal: false, returnDocument: "after"
        });
    return res;
}

const changePhase = async (lobbyId, phase) => {
    const res = await db.findOneAndUpdate(
        { lobbyId: lobbyId },
        {
            $set: {
                phase: phase
            }
        },
        {
            returnOriginal: false, returnDocument: "after"
        });
    return res.value;
}

const clearRound = async (lobbyId) => {
    const res = await db.findOneAndUpdate(
        { lobbyId: lobbyId },
        {
            $set: {
                "seats.$[].isTurn": false, "seats.$[].isBusted": false, "seats.$[].currentBet": 0, "seats.$[].cards": [], "table.tableCards": []
            }
        });
    return res;
}

const deleteRoom = async (lobbyId) => {
    db.deleteOne({ lobbyId: lobbyId });
    console.log('room deleted ' + lobbyId)
}

const disconnectWithSocketId = async (lobbyId, socketId) => {
    const res = await db.findOneAndUpdate(
        { lobbyId: lobbyId, "seats.socketId": socketId },
        { $set: { [`seats.$.isSeated`]: false, [`seats.$.socketId`]: "", [`seats.$.name`]: "", [`seats.$.cash`]: 200, [`seats.$.cards`]: [], [`seats.$.isBusted`]: false } },
        { returnOriginal: false, returnDocument: "after" });
    return (res.value);
};

export { initializeLobby, getLobbyData, findLobby, openTableCard, startTurnLoop, skipTurn, endTurnLoop, clearRound, getActiveSeats, getSeatedSeats, disconnectWithSocketId, changePhase, deleteRoom };

