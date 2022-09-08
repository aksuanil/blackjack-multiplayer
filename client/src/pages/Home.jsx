import React, { useState } from 'react';

export default function Home() {
    const [isHovering, setIsHovering] = useState(false);

    const handleJoinRoom = () => {

    }
    const handleCreateRoom = () => {

    }
    return (
        <div className='flex flex-col justify-center items-center bg-green-800 h-[100vh] overflow-hidden'>
            <img src='' />
            <form className='flex flex-col items-center border-4 border-amber-600 rounded-xl bg-amber-600 transition-all duration-500' onSubmit={handleJoinRoom} action="#"
                style={{ boxShadow: isHovering && '0 0 12px 6px #fcba03, 0 0 20px 12px #c2bc1b, 0 0 28px 18px #c94d0a' }} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                <div className='flex flex-col items-center shadow-inner shadow-black rounded-xl w-fit p-4 px-12 bg-green-600 gap-2'>
                    <button onClick={handleCreateRoom} className='border-black border-2 hover:bg-black hover:text-white mt-2 px-2 rounded-sm'>Create Room</button>
                    <div>OR</div>
                    <label>Join a game with Room ID:</label>
                    <input
                        autoComplete='off'
                        className='shadow-inner shadow-black text-center text-white border-2 outline-amber-900 border-amber-900 font-semibold rounded-lg p-1 placeholder:text-gray-300 bg-amber-600 focus:bg-amber-700 bg-opacity-90 transition-all'
                        type="text"
                        name="username"
                        placeholder="Enter username"
                        required
                    />
                    <input
                        autoComplete='off'
                        className='shadow-inner shadow-black text-center border-2 text-white outline-amber-900 border-amber-900 font-semibold uppercase placeholder:capitalize placeholder:text-gray-300 rounded-lg p-1 bg-amber-600 bg-opacity-90 focus:bg-amber-700 transition-all'
                        name="roomId"
                        placeholder="Enter Room ID"
                        required
                    />
                    <button onClick={handleJoinRoom} className='border-black border-2 hover:bg-amber-600 rounded-lg hover:text-white mt-2 p-2 px-8 font-bold ' type="submit" value="Join">Join</button>
                </div>
            </form>
        </div >
    )
}
