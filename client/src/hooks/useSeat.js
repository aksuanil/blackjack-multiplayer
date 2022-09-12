import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../context/SocketProvider.js';
import { cardValues } from '../helpers/cardHelpers.js';

export default function useSeat({ index, isSeated, setIsSeated, setPlayerSeatIndex }) {
    const [cardsValue, setCardsValue] = useState(99)
    const { emitAction, lobbyData, socket } = useContext(SocketContext);

    const [tableCardsValue, setTableCardsValue] = useState(0)
    useEffect(() => {
        let tableValue = 0;
        lobbyData?.table?.tableCards?.forEach(element => {

        });
        lobbyData?.table?.tableCards?.map((card) => {
            tableValue += cardValues[card]
        })
        setTableCardsValue(tableValue)

    }, [JSON.stringify(lobbyData?.table?.tableCards)])

    const onClickSeat = (index) => {
        emitAction('getSeated', lobbyData.lobbyId, { seatId: index, socketId: socket.id, name: 'test name' });
        setIsSeated(true)
        setPlayerSeatIndex(index)
    }
    const onClickUnseat = (index) => {
        emitAction('getUnseated', lobbyData.lobbyId, { seatId: index });
        setIsSeated(false)
    }
    useEffect(() => {
        let val = 0;
        lobbyData?.seats[index]?.cards?.map((card) => {
            setCardsValue(val += cardValues[card])
        })
        if (lobbyData?.seats[index]?.cards.length === 0) {
            setCardsValue(0)
        }
    }, [JSON.stringify(lobbyData?.seats[index]?.cards)])

    useEffect(() => {
        if (lobbyData?.phase === 'PLAYING' && cardsValue > 21) {
            emitAction('setBusted', lobbyData.lobbyId, { seatId: index, isBusted: true });
        }
        else if (lobbyData?.phase === 'ROUND_END' && tableCardsValue <= 21 && cardsValue !== 0) {
            emitAction('setBusted', lobbyData.lobbyId, { seatId: index, isBusted: true });
        }
        if (!lobbyData?.seats[index]?.isBusted) {
            if (lobbyData?.phase === 'PLAYING' && cardsValue === 21) {
                emitAction('addCash', lobbyData.lobbyId, { seatId: index, cashAmount: lobbyData?.seats[index]?.currentBet * 2.5 });
            }
            else if (lobbyData?.phase === 'ROUND_END' && tableCardsValue > 21) {
                emitAction('addCash', lobbyData.lobbyId, { seatId: index, cashAmount: lobbyData?.seats[index]?.currentBet * 2.5 });
            }
            else if (lobbyData?.phase === 'ROUND_END' && cardsValue > tableCardsValue) {
                emitAction('addCash', lobbyData.lobbyId, { seatId: index, cashAmount: lobbyData?.seats[index]?.currentBet * 2.5 });
            }
        }
    }, [cardsValue, tableCardsValue])

    return { cardsValue, lobbyData, socket, onClickSeat };

}
