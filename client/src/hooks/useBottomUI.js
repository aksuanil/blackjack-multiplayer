import { useState, useContext } from 'react'
import { SocketContext } from '../context/SocketProvider';

export default function useBottomUI({ playerSeatIndex }) {
    const { emitAction, lobbyData } = useContext(SocketContext);
    const [warningMessage, setWarningMessage] = useState('');
    // const onClickUnseat = (index) => {
    //     emitAction('getUnseated', lobbyData.lobbyId, { seatId: index });
    //     props.setIsSeated(false)
    // }
    const onClickHit = (index) => {
        emitAction('addCard', lobbyData.lobbyId, { seatId: playerSeatIndex });
    }
    const onClickPass = (index) => {
        //
    }
    const onClickBet = (betAmount) => {
        if (betAmount < lobbyData?.seats[playerSeatIndex]?.cash) {
            emitAction('setBet', lobbyData.lobbyId, { seatId: playerSeatIndex, betAmount: betAmount });
        }
        else {
            setWarningMessage('Insufficient credits!');
        }
    }

    return { lobbyData, warningMessage, setWarningMessage, onClickHit, onClickBet };

}
