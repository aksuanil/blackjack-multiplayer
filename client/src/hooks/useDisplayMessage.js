import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../context/SocketProvider';

export default function useDisplayMessage({ containerRef }) {
    const { emitSendMessage, onReceiveMessage, onSystemMessage, lobbyData } = useContext(SocketContext);

    const [message, setMessage] = useState('');

    const appendMessage = (message, color) => {
        const div = document.createElement("div")
        div.textContent = `${message}`
        console.log(color)
        switch (color) {
            case 'red':
                div.style.color = 'red'
                div.style.fontWeight = '700'
                break;
            case 'orange':
                div.style.color = 'orange'
                div.style.fontWeight = '700'
                break;
            default:
                break;
        }
        containerRef?.current?.append(div)
    }
    useEffect(() => {
        onReceiveMessage(appendMessage);
        onSystemMessage(appendMessage);
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
