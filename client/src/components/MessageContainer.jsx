import React, { useRef } from 'react'
import useDisplayMessage from '../hooks/useDisplayMessage'

export default function MessageContainer() {
    const containerRef = useRef();

    const { handleMessageSubmit, setMessage, message } = useDisplayMessage({ containerRef })

    return (
        <div className='flex flex-col absolute top-24 ml-4 w-96 h-full z-40'>
            <div id='message-container' ref={containerRef} className='flex flex-col border-2 rounded-t-xl grow p-2 border-zinc-600 overflow-y-auto bg-zinc-700 bg-opacity-70'>
            </div>
            <form className='flex flex-row' onSubmit={handleMessageSubmit}>
                <input className='border-2 grow border-zinc-600 bg-zinc-700'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    id='message-input'
                    type="text">
                </input>
                <button className='px-2 border-2 border-black' type="submit">Send</button>
            </form>
        </div>
    )
}
