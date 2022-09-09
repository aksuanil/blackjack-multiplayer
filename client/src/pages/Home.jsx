import React, { useState, useRef } from 'react';
import blackjackLogo from '../assets/images/blackjack-logo.png'
import blackjackLogoBorder from '../assets/images/blackjack-logo-border.png'
import style from '../assets/css/style.css'
export default function Home() {
    const imgRef = useRef();

    const [isHovering, setIsHovering] = useState(false);

    const handleJoinRoom = () => {

    }
    const handleCreateRoom = () => {

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
        <div className='flex flex-col justify-around items-center bg-gradient-to-r from-green-900 via-black to-green-900 h-[100vh]'
            style={{ '--tw-gradient-stops': 'var(--tw-gradient-from) -30%, currentcolor, var(--tw-gradient-to) 130%', }}>
            <div ref={imgRef} onLoad={logoAnimation} className='w-96 transition-all duration-[2000ms] drop-shadow-[0_30px_50px_#FF008F] ' >
                <img className='borderLogo' src={blackjackLogoBorder} alt='logo' />

            </div>
            <form className='flex flex-col items-center border-4 border-amber-600 rounded-xl bg-amber-600 transition-all duration-500' onSubmit={handleJoinRoom} action="#"
                style={{ boxShadow: isHovering && '0 0 12px 6px #fcba03, 0 0 20px 12px #c2bc1b, 0 0 28px 18px #c94d0a' }} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                <div className='flex flex-col items-center shadow-inner shadow-black rounded-xl w-fit p-4 px-12 bg-green-600 gap-2'>
                    <button onClick={handleCreateRoom} className='border-black border-2 hover:bg-black hover:text-white mt-2 px-2 rounded-sm'>Create Room</button>
                    <div>OR</div>
                    <label>Join a game with Room ID:</label>
                    <input
                        autoComplete='off'
                        className='shadow-inner shadow-black text-center text-white border-2 outline-amber-900 border-amber-900 font-semibold rounded-lg p-1 placeholder:text-gray-300 placeholder:font-thin  bg-amber-600 focus:bg-amber-700 bg-opacity-90 transition-all'
                        type="text"
                        name="username"
                        placeholder="Enter username"
                        required
                    />
                    <input
                        autoComplete='off'
                        className='shadow-inner shadow-black text-center border-2 text-white outline-amber-900 border-amber-900 font-semibold uppercase placeholder:normal-case	 placeholder:text-gray-300 placeholder:font-thin rounded-lg p-1 bg-amber-600 bg-opacity-90 focus:bg-amber-700 transition-all'
                        name="roomId"
                        placeholder="Enter room ID"
                        required
                    />
                    <button onClick={handleJoinRoom} className='border-black border-2 hover:bg-amber-600 rounded-lg hover:text-white mt-2 p-2 px-8 font-bold ' type="submit" value="Join">Join</button>
                </div>
            </form>
        </div >
    )
}
