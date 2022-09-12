import { useEffect, useState, useContext } from 'react'
import { SocketContext } from '../context/SocketProvider';
import { cardValues } from '../helpers/cardHelpers.js';

export default function useGameLobby({ lobbyId, state }) {
    const { emitJoin, onConnect, onUpdate, onCountdown, lobbyData, isLoading } = useContext(SocketContext);
    const [usernamePopup, setUsernamePopup] = useState(false)
    
    useEffect(() => {
        emitJoin(lobbyId, state?.isCreate);
        if (state?.username) {
            onConnect(lobbyId, state.username);
        }
        else {
            onConnect(lobbyId);
            setUsernamePopup(true);
        }
        onUpdate();
        onCountdown();
    }, []);

    const [tableCardsValue, setTableCardsValue] = useState(0);
    const [playerSeatIndex, setPlayerSeatIndex] = useState(null);

    useEffect(() => {
        let tableValue = 0;
        lobbyData?.table?.tableCards?.map((card) => {
            tableValue += cardValues[card]
        })
        setTableCardsValue(tableValue)

    }, [JSON.stringify(lobbyData?.table?.tableCards)])

    return { tableCardsValue, playerSeatIndex, usernamePopup, isLoading, setUsernamePopup, setPlayerSeatIndex };

}
