import { db } from '../mongoUtil.js'

const initializeLobby = (lobbyId) => {
    db.insertOne({
        lobbyId: lobbyId,
        phase: "",
        seats: [
            { id: 0, socketId: "", name: "", status: false, cash: 0, cards: [], bet: 0, isTurn: false },
            { id: 1, socketId: "", name: "", status: false, cash: 0, cards: [], bet: 0, isTurn: false },
            { id: 2, socketId: "", name: "", status: false, cash: 0, cards: [], bet: 0, isTurn: false },
            { id: 3, socketId: "", name: "", status: false, cash: 0, cards: [], bet: 0, isTurn: false },
        ],
        table: {
            deck: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
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
        // Get just the docs that contain a shapes element where color is 'red'
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

const openCard = async (lobbyId) => {
    // let randomCard;

    // await db.find({ lobbyId: lobbyId }).project({ "table.deck": 1, _id: 0 }).forEach((item) => {
    //     randomCard = item.table.deck[Math.floor(Math.random() * item.table.deck.length)];
    // });
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
    return res;
}


const disconnectWithSocketId = async (lobbyId, socketId) => {
    const res = await db.findOneAndUpdate(
        { lobbyId: lobbyId, "seats.socketId": socketId },
        { $set: { [`seats.$.status`]: false, [`seats.$.socketId`]: "", [`seats.$.name`]: "", [`seats.$.cash`]: 0, [`seats.$.cards`]: [] } },
        { returnOriginal: false, returnDocument: "after" });
    return (res.value);
};

export { initializeLobby, getLobbyData, openCard, startTurnLoop, endTurnLoop, getActiveSeats, disconnectWithSocketId, changePhase };
