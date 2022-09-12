import { useState, useContext, useEffect } from 'react';
import { SocketContext } from '../context/SocketProvider';

export default function useDisplayMessage({ containerRef }) {
    const { emitSendMessage, onReceiveMessage, lobbyData } = useContext(SocketContext);

    const [message, setMessage] = useState('');
    const appendMessage = (message) => {
        const div = document.createElement("div")
        div.textContent = `${message}`
        containerRef?.current?.append(div)
    }
    useEffect(() => {
        onReceiveMessage(appendMessage);
    }, [])

    const handleMessageSubmit = (e) => {
        e.preventDefault();
        emitSendMessage(message, lobbyData.lobbyId);
        const div = document.createElement("div")
        div.textContent = `${message}`
        containerRef?.current?.append(div)
        setMessage('')
    }
    return { setMessage, handleMessageSubmit, message, appendMessage }
}
