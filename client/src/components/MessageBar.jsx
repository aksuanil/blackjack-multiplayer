import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../context/SocketProvider';

export default function MessageBar(props) {
    const { lobbyData, countdown } = useContext(SocketContext);
    const [message, setMessage] = useState('');

    useEffect(() => {
        switch (lobbyData?.phase) {
            case "BETTING":
                setMessage('PLEASE PLACE YOUR BET')
                break;
            case "NOT_STARTED":
                setMessage('PLEASE TAKE A SEAT TO START THE GAME')
                break;
            case "INTERMISSION":
                setMessage('ROUND WILL BEGIN SHORTLY')
                break;
            default:
                setMessage('')
                break;
        }

    }, [JSON.stringify(lobbyData)])

    return (
        <>
            {message && <div className='animate-fadeIn self-center text-center w-1/2 bg-gradient-to-r from-transparent via-zinc-500 to-transparent py-2 bg-opacity-40 font-semibold'>
                <div>{message}</div>
                <div>{countdown}</div>
            </div>}
        </>
    )
}
