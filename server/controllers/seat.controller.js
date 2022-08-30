import { db } from '../mongoUtil.js'
import { getActiveSeats, getLobbyData } from './lobby.controller.js';

const getSeated = async (lobbyId, seatId, socketId, name) => {
    const res = await db.findOneAndUpdate(
        { lobbyId: lobbyId },
        { $set: { [`seats.${seatId}.status`]: true, [`seats.${seatId}.socketId`]: socketId } },
        { returnOriginal: false, returnDocument: "after" });
    return (res.value);
};

const getUnseated = async (lobbyId, seatId) => {
    const res = await db.findOneAndUpdate(
        { lobbyId: lobbyId },
        { $set: { [`seats.${seatId}.status`]: false, [`seats.${seatId}.socketId`]: "", [`seats.${seatId}.cash`]: 0, [`seats.${seatId}.cards`]: [] } },
        { returnOriginal: false, returnDocument: "after" });
    return (res.value);
};

const addCash = (lobbyId, seatId, cashAmount) => {
    db.updateOne(
        { lobbyId: lobbyId },
        { $inc: { [`seats.${seatId}.cash`]: cashAmount } }, (err, lobby) => {
            if (err) {
                console.log(err);
            } else {
                console.log(lobby);
            }
        })
};

const addCard = async (lobbyId, seatId) => {
    const res = await db.findOneAndUpdate(
        { lobbyId: lobbyId },
        { $push: { [`seats.${seatId}.cards`]: Math.floor(Math.random() * 52) } },
        { returnOriginal: false, returnDocument: "after" })
    return (res.value);
};

const addStartingCards = async (lobbyId) => {
    const result = await getActiveSeats(lobbyId);
    let res;
    if (result) {
        for (let i = 0; i < result.seats.length; i++) {
            res = await addCard(lobbyId, result.seats[i].id)
        }
    }
    return res;
};

const clearCards = (lobbyId, seatId) => {
    db.updateOne(
        { lobbyId: lobbyId },
        { $set: { [`seats.${seatId}.cards`]: [] } }, (err, lobby) => {
            if (err) {
                console.log(err);
            } else {
                console.log(lobby);
            }
        })
};

export { getSeated, getUnseated, addCash, addCard, clearCards, addStartingCards };
