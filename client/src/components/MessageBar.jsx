import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../context/SocketProvider';

export default function MessageBar(props) {
    const { lobbyData } = useContext(SocketContext);
    const [message, setMessage] = useState('');
    const [messageTimer, setMessageTimer] = useState(10);

    useEffect(() => {
        const timerInterval = setInterval(() => {
            setMessageTimer((t) => t - 1);
        }, 1000);
        return () => clearInterval(timerInterval);
    }, []);

    useEffect(() => {
        switch (lobbyData.phase) {
            case "BETTING":
                setMessage('PLEASE PLACE YOUR BET')
                setMessageTimer(10)
                break;
            case "INTERMISSION":
                setMessage('ROUND WILL BEGIN SHORTLY')
                setMessageTimer(6)
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
                <div>{messageTimer}</div>
            </div>}
        </>
    )
}
