import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import tableArt from '../assets/images/Table.jpg';
import BottomUI from '../components/BottomUI';
import MessageBar from '../components/MessageBar';
import SeatSection from '../components/SeatSection';
import Table from '../components/Table';
import { SocketContext } from '../context/SocketProvider';
import { cardValues } from '../helpers/cardHelpers.js';

function GameLobby() {
    const usernameRef = useRef()
    let { lobbyId } = useParams();
    const { emitJoin, onConnect, onUpdate, lobbyData } = useContext(SocketContext);
    const { state } = useLocation();
    const [usernamePopup, setUsernamePopup] = useState(false)
    onUpdate()
    useEffect(() => {
        // emitJoin(lobbyId);
        if (state?.username !== undefined) {
            onConnect(lobbyId, state.username);
        }
        else {
            setUsernamePopup(true);
        }
    }, []);

    const [tableCardsValue, setTableCardsValue] = useState(0)
    const [playerSeatIndex, setPlayerSeatIndex] = useState(null)
    const onSubmit = (e) => {
        e.preventDefault();
        onConnect(lobbyId, usernameRef.current.value);
        setUsernamePopup(false);
    }
    useEffect(() => {
        let tableValue = 0;
        lobbyData?.table?.tableCards?.map((card) => {
            tableValue += cardValues[card]
        })
        setTableCardsValue(tableValue)

    }, [JSON.stringify(lobbyData?.table?.tableCards)])
    return (
        <>
            {usernamePopup &&
                <div className='absolute flex justify-center items-center h-screen z-50 w-screen  bg-black bg-opacity-80 transition-all duration-500'>
                    <form className='flex flex-col bg-black p-8 border-4 rounded-xl border-amber-900' onSubmit={onSubmit}>
                        <label className=' text-center pb-4 text-white'>Provide a username to join lobby</label>
                        <div className='flex flex-col grow justify-center'>
                            <input
                                ref={usernameRef}
                                autoComplete='off'
                                className='text-center border-b-2 border-amber-700 bg-gradient-to-t from-gray-800 to-black text-white outline-none font-semibold p-1 placeholder:font-thin'
                                type="text"
                                name="usernameCreate"
                                placeholder="Enter username"
                                required
                            />
                            <button type='submit' className='border-black border-2 bg-amber-700 hover:bg-amber-600 rounded-lg hover:text-white mt-2 p-2 px-8 font-bold '>Enter Lobby</button>
                        </div>
                    </form>
                </div>
            }
            <div className='flex flex-col h-[100vh] overflow-hidden' style={{ background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${tableArt})`, backgroundSize: 'cover' }}>
                <Table tableCardsValue={tableCardsValue} />
                <MessageBar playerSeatIndex={playerSeatIndex} />
                <SeatSection tableCardsValue={tableCardsValue} setPlayerSeatIndex={setPlayerSeatIndex} />
                <BottomUI playerSeatIndex={playerSeatIndex} />
            </div>
        </>
    );
}

export default GameLobby;


