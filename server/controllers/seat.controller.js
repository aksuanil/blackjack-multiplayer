import { db } from '../mongoUtil.js';
import { getActiveSeats, getLobbyData } from './lobby.controller.js';

const getSeated = async (lobbyId, seatId, socketId, name) => {
    const res = await db.findOneAndUpdate(
        { lobbyId: lobbyId },
        { $set: { [`seats.${seatId}.status`]: true, [`seats.${seatId}.socketId`]: socketId, [`seats.${seatId}.name`]: name } },
        { returnOriginal: false, returnDocument: "after" });
    return (res.value);
};

const getUnseated = async (lobbyId, seatId) => {
    const res = await db.findOneAndUpdate(
        { lobbyId: lobbyId },
        { $set: { [`seats.${seatId}.status`]: false, [`seats.${seatId}.socketId`]: "", [`seats.${seatId}.cash`]: 200, [`seats.${seatId}.cards`]: [], [`seats.${seatId}.isTurn`]: false, [`seats.${seatId}.isBusted`]: false } },
        { returnOriginal: false, returnDocument: "after" });
    return (res.value);
};

const addCash = async (lobbyId, seatId, cashAmount) => {
    console.log('beat amount' + cashAmount)
    const res = await db.findOneAndUpdate(
        { lobbyId: lobbyId },
        { $inc: { [`seats.${seatId}.cash`]: cashAmount } },
        { returnOriginal: false, returnDocument: "after" });
    return (res.value);
};

const addBet = async (lobbyId, seatId, betAmount) => {
    await addCash(lobbyId, seatId, -betAmount)
    const res = await db.findOneAndUpdate(
        { lobbyId: lobbyId },
        { $inc: { [`seats.${seatId}.currentBet`]: betAmount } },
        { returnOriginal: false, returnDocument: "after" });
    return (res.value);
};

const addCard = async (lobbyId, seatId) => {
    const res = await db.findOneAndUpdate(
        { lobbyId: lobbyId },
        { $push: { [`seats.${seatId}.cards`]: Math.floor(Math.random() * 52) } },
        { returnOriginal: false, returnDocument: "after" })
    return (res.value);
};

const addStartingCards = async (lobbyId, activeSeats) => {
    let res;
    if (activeSeats) {
        for (let i = 0; i < activeSeats.seats.length; i++) {
            await addCard(lobbyId, activeSeats.seats[i].id)
            res = await addCard(lobbyId, activeSeats.seats[i].id)
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

const setBusted = async (lobbyId, seatId, isBusted) => {
    const res = await db.findOneAndUpdate(
        { lobbyId: lobbyId },
        { $set: { [`seats.${seatId}.isBusted`]: isBusted } },
        { returnOriginal: false, returnDocument: "after" })
    return (res.value);
};

export { getSeated, getUnseated, addCash, addCard, clearCards, addStartingCards, setBusted, addBet };

