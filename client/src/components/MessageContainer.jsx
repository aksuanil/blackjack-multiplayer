import React, { useRef } from 'react';
import useDisplayMessage from '../hooks/useDisplayMessage';

export default function MessageContainer() {
    const containerRef = useRef();

    const { handleMessageSubmit, setMessage, message } = useDisplayMessage({ containerRef })

    return (
        <div className='flex flex-col w-1/3 opacity-70 hover:opacity-100 absolute top-2 ml-2 h-2/3 z-40 bg-gradient-to-t to-transparent via-amber-700 from-amber-900 bg-size-300 bg-pos-0 hover:bg-pos-15 duration-500 transition-all'>
            <div id='message-container' ref={containerRef} className='flex flex-col border-2 border-y-0 grow p-2 border-zinc-600 overflow-y-auto '>
            </div>
            <form className='flex flex-row' onSubmit={handleMessageSubmit}>
                <input className='border-2 border-zinc-900 grow bg-transparent text-amber-200 font-semibold tracking-wide outline-none '
                    autoComplete='off'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    id='message-input'
                    type="text">
                </input>
                <button className='px-2 border-2 border-black bg-amber-900 hover:bg-amber-700 duration-500 transition-all' type="submit">Send</button>
            </form>
        </div>
    )
}
