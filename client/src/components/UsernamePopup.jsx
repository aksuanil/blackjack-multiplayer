import React, { useContext, useRef } from 'react';
import { SocketContext } from '../context/SocketProvider';

export default function UsernamePopup({ popupCallback }) {
    const { emitJoin, lobbyData } = useContext(SocketContext);

    const usernameRef = useRef()
    const onSubmit = (e) => {
        e.preventDefault();
        emitJoin(lobbyData.lobbyId, false, usernameRef.current.value);
        popupCallback(false);
    }
    return (
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
    )
}
