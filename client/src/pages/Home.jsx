import React, { useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import style from '../assets/css/style.css';
import blackjackLogoBorder from '../assets/images/blackjack-logo-border.png';
import blackjackLogo from '../assets/images/blackjack-logo.png';
import { createRoomId } from '../helpers/formHelpers.js';

export default function Home() {
    const imgRef = useRef();
    const [username, setUsername] = useState('');
    const [lobbyId, setLobbyId] = useState('');

    const navigate = useNavigate();
    const handleJoinRoom = (e) => {
        e.preventDefault();
        navigate(`/lobby/${lobbyId}`, { state: { username: username } })
    }
    const handleCreateRoom = (e) => {
        e.preventDefault();
        navigate(`/lobby/${createRoomId(6)}`, { state: { username: username } })
    }
    const logoAnimation = () => {
        const obj = ['drop-shadow(0px 35px 50px #BA00DD)', 'drop-shadow(0px 35px 50px #FFB700)', 'drop-shadow(0px 35px 50px #00B4C4)', 'drop-shadow(0px 35px 50px #FF008F)']
        const divElement = imgRef.current;
        let i = 4;
        setInterval(() => {
            i--;
            divElement.style.setProperty("-webkit-filter", `${obj[i]}`)
            if (i === 0) {
                i = 4;
            }
        }, 3000)
    }
    return (
        <div className='flex flex-col justify-around items-center bg-gradient-to-r from-green-800 via-black to-green-800 min-h-screen gap-10 md:gap-0'
            style={{ '--tw-gradient-stops': 'var(--tw-gradient-from) -40%, currentcolor, var(--tw-gradient-to) 140%', }}>
            <div ref={imgRef} onLoad={logoAnimation} className='w-80 transition-all duration-[2000ms] drop-shadow-[0_30px_50px_#FFB700]' >
                <img className='borderLogo' src={blackjackLogoBorder} alt='logo' />

            </div>
            <div className='flex flex-col items-center border-4 border-amber-600 rounded-xl bg-amber-600'>
                <div className='flex flex-col md:flex-row items-center shadow-inner shadow-black rounded-xl w-fit p-4 px-4 md:px-12 bg-gray-900 bg-opacity-90 gap-4 md:gap-12 text-white'>
                    <form className='flex flex-col h-full' onSubmit={handleCreateRoom} action="#">
                        <label className='underline underline-offset-4 text-center pb-4 '>Create a new room</label>
                        <div className='flex flex-col grow justify-center'>
                            <input
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete='off'
                                className='shadow-inner mb-1 shadow-black text-center text-white border-2 outline-amber-900 border-amber-900 font-semibold rounded-lg p-1 placeholder:text-gray-300 placeholder:font-thin  bg-amber-600 focus:bg-amber-700 bg-opacity-90 transition-all'
                                type="text"
                                name="usernameCreate"
                                placeholder="Enter username"
                                required
                            />
                            <button type='submit' className='border-black border-2 hover:bg-amber-600 rounded-lg hover:text-white mt-2 p-2 px-8 font-bold '>Create Room</button>
                        </div>
                    </form>
                    <div>OR</div>
                    <form className='flex flex-col' onSubmit={handleJoinRoom} action="#">
                        <label className='underline underline-offset-4 text-center pb-4'>Join a game with Room ID</label>
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete='off'
                            className='shadow-inner mb-1 shadow-black text-center text-white border-2 outline-amber-900 border-amber-900 font-semibold rounded-lg p-1 placeholder:text-gray-300 placeholder:font-thin  bg-amber-600 focus:bg-amber-700 bg-opacity-90 transition-all'
                            type="text"
                            name="usernameJoin"
                            placeholder="Enter username"
                            required
                        />
                        <input
                            onChange={(e) => setLobbyId(e.target.value)}
                            autoComplete='off'
                            className='shadow-inner shadow-black text-center border-2 text-white outline-amber-900 border-amber-900 font-semibold uppercase placeholder:normal-case	 placeholder:text-gray-300 placeholder:font-thin rounded-lg p-1 bg-amber-600 bg-opacity-90 focus:bg-amber-700 transition-all'
                            name="roomId"
                            placeholder="Enter room ID"
                            required
                        />
                        <button type='submit' className='border-black border-2 hover:bg-amber-600 rounded-lg hover:text-white mt-2 p-2 px-8 font-bold '>Join</button>
                    </form>
                </div>
            </div>
        </div >
    )
}
