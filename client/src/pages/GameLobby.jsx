import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import tableArt from '../assets/images/Table.jpg';
import BottomUI from '../components/BottomUI';
import MessageBar from '../components/MessageBar';
import SeatSection from '../components/SeatSection';
import Spinner from '../components/Spinner';
import Table from '../components/Table';
import UsernamePopup from '../components/UsernamePopup';
import useGameLobby from '../hooks/useGameLobby';

function GameLobby() {
    let { lobbyId } = useParams();
    const { state } = useLocation();
    const { tableCardsValue, playerSeatIndex, usernamePopup, isLoading, setUsernamePopup, setPlayerSeatIndex } = useGameLobby({ lobbyId, state })
    return (
        <>
            {isLoading
                ?
                <Spinner />
                :
                <>
                    {usernamePopup && <UsernamePopup popupCallback={setUsernamePopup} />}
                    <div className='flex flex-col h-[100vh] overflow-hidden' style={{ background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${tableArt})`, backgroundSize: 'cover' }}>
                        <Table tableCardsValue={tableCardsValue} />
                        <MessageBar playerSeatIndex={playerSeatIndex} />
                        <SeatSection tableCardsValue={tableCardsValue} setPlayerSeatIndex={setPlayerSeatIndex} />
                        <BottomUI playerSeatIndex={playerSeatIndex} />
                    </div>
                </>
            }
        </>
    );
}

export default GameLobby;


