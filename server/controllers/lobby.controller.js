import { db } from '../mongoUtil.js';

const initializeLobby = (lobbyId) => {
    db.insertOne({
        lobbyId: lobbyId,
        phase: "NOT_STARTED",
        seats: [
            { id: 0, socketId: "", name: "", status: false, cash: 200, cards: [], bet: 0, isTurn: false },
            { id: 1, socketId: "", name: "", status: false, cash: 200, cards: [], bet: 0, isTurn: false },
            { id: 2, socketId: "", name: "", status: false, cash: 200, cards: [], bet: 0, isTurn: false },
            { id: 3, socketId: "", name: "", status: false, cash: 200, cards: [], bet: 0, isTurn: false },
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

const getActiveSeats = async (lobbyId) => {
    const result = await db.aggregate([
        { $match: { lobbyId: lobbyId, 'seats.status': true } },
        {
            $project: {
                seats: {
                    $filter: {
                        input: '$seats',
                        as: 'seats',
                        cond: { $eq: ['$$seats.status', true] }
                    }
                }
            }
        }
    ]).toArray();

    // const result = await db.find({ lobbyId: lobbyId, "seats.status": true }).project({ seats: 1, _id: 0 }).toArray();
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
}

const disconnectWithSocketId = async (lobbyId, socketId) => {
    const res = await db.findOneAndUpdate(
        { lobbyId: lobbyId, "seats.socketId": socketId },
        { $set: { [`seats.$.status`]: false, [`seats.$.socketId`]: "", [`seats.$.name`]: "", [`seats.$.cash`]: 200, [`seats.$.cards`]: [], [`seats.$.isBusted`]: false } },
        { returnOriginal: false, returnDocument: "after" });
    return (res.value);
};

export { initializeLobby, getLobbyData, openTableCard, startTurnLoop, endTurnLoop, clearRound, getActiveSeats, disconnectWithSocketId, changePhase, deleteRoom };

