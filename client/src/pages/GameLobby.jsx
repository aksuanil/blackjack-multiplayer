import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import tableArt from '../assets/images/Table.jpg';
import BottomUI from '../components/BottomUI';
import MessageBar from '../components/MessageBar';
import SeatSection from '../components/SeatSection';
import Table from '../components/Table';
import { SocketContext } from '../context/SocketProvider';
import { cardValues } from '../helpers/cardHelpers.js';

function GameLobby() {
    let { lobbyId } = useParams();
    const { onConnect, onUpdate, lobbyData } = useContext(SocketContext);

    onUpdate()
    useEffect(() => {
        onConnect(lobbyId);
    }, []);

    const [tableCardsValue, setTableCardsValue] = useState(0)
    const [playerSeatIndex, setPlayerSeatIndex] = useState(null)

    useEffect(() => {
        let tableValue = 0;
        lobbyData?.table?.tableCards?.map((card) => {
            tableValue += cardValues[card]
        })
        setTableCardsValue(tableValue)

    }, [JSON.stringify(lobbyData?.table?.tableCards)])
    return (
        <div className='flex flex-col h-[100vh] overflow-hidden' style={{ background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${tableArt})`, backgroundSize: 'cover' }}>
            <Table tableCardsValue={tableCardsValue} />
            <MessageBar playerSeatIndex={playerSeatIndex} />
            <SeatSection tableCardsValue={tableCardsValue} setPlayerSeatIndex={setPlayerSeatIndex} />
            <BottomUI playerSeatIndex={playerSeatIndex} />
        </div>
    );
}

export default GameLobby;


