import React from 'react';
import addCard from '../assets/images/addCard.svg';
import doubleIcon from '../assets/images/doubleIcon.svg';
import standIcon from '../assets/images/standIcon.svg';

import Chip10 from '../assets/images/10.svg';
import Chip100 from '../assets/images/100.svg';
import Chip20 from '../assets/images/20.svg';
import Chip5 from '../assets/images/5.svg';
import Chip50 from '../assets/images/50.svg';
import Chip500 from '../assets/images/500.svg';
import useBottomUI from '../hooks/useBottomUI';
import PopupUI from './PopupUI';

export default function BottomUI({ playerSeatIndex }) {
    const { lobbyData, warningMessage, setWarningMessage, onClickHit, onClickBet } = useBottomUI({ playerSeatIndex })
    return (
        <>
            <div className='curve bg-gradient-to-t from-yellow-900 via-yellow-700 to-yellow-900 flex items-center border-t-4 border-yellow-900 shadow-[0_35px_20px_35px_rgba(0,0,0,1)]'>
                <div className='flex w-1/3 justify-center gap-4 '>
                    <div className='bg-green-800  shadow-black shadow-inner rounded-xl px-4 py-1 text-xl font-semibold'>Cash: {lobbyData?.seats[playerSeatIndex]?.cash}$</div>
                    <div className='bg-green-800  shadow-black shadow-inner rounded-xl px-4 py-1 text-xl font-semibold'>Bet: {lobbyData?.seats[playerSeatIndex]?.currentBet}$</div>
                </div>

                {(lobbyData?.phase === 'PLAYING' && lobbyData?.seats[playerSeatIndex]?.isTurn && !lobbyData?.seats[playerSeatIndex]?.isBusted)
                    ?
                    <div className='flex gap-12 w-1/3 justify-center p-4'>
                        <button className='border-2 border-black rounded-full font-bold w-20 shadow-black shadow-md  bg-green-800 text-sm'><img className='w-8 mx-auto' src={doubleIcon} alt='DoubleIcon' />DOUBLE</button>
                        <button onClick={() => onClickHit(playerSeatIndex)} className='border-2 border-black rounded-full w-20 bg-red-700 hover:bg-red-600 shadow-black shadow-md  font-bold transition-all duration-200'><img className='w-10 mx-auto' src={addCard} alt='AddCardIcon' />HIT</button>
                        <button className='border-2 border-black rounded-full h-20 w-20 bg-gradient-to-t from-yellow-800 via-yellow-500 to-yellow-800 shadow-black shadow-md font-bold'><img className='w-8 mx-auto' src={standIcon} alt='StandIcon' />STAND</button>
                    </div>
                    :
                    <div className='flex gap-12 w-1/3 justify-center p-4'>
                        <button disabled className='border-2 border-black rounded-full w-20 bg-green-800 opacity-50 font-bold shadow-black shadow-inner text-sm'><img className='w-8 mx-auto' src={doubleIcon} alt='DoubleIcon' />DOUBLE</button>
                        <button disabled className='border-2 border-black rounded-full w-20 bg-red-700 font-bold opacity-50 shadow-black shadow-inner'><img className='w-10 mx-auto' src={addCard} alt='AddCardIcon' />HIT</button>
                        <button disabled className='border-2 border-black rounded-full h-20 w-20 bg-yellow-600 opacity-50 font-bold shadow-black shadow-inner'><img className='w-8 mx-auto' src={standIcon} alt='StandIcon' />STAND</button>
                    </div>
                }
                <div className='flex w-1/3 justify-center rounded-full rounded-r-none transition-all duration-500' style={{ boxShadow: lobbyData?.phase === 'BETTING' && '0 0 6px 3px #fff, 0 0 10px 6px #f0f, 0 0 14px 9px #0ff' }}>
                    <div className='flex gap-4 justify-center bg-green-800 shadow-inner shadow-black rounded-full rounded-r-none w-full py-2 relative'>
                        <div className='absolute -top-3/4'>
                            {warningMessage && <PopupUI message={warningMessage} messageCallback={setWarningMessage} />}
                        </div>
                        <button disabled={lobbyData?.phase !== 'BETTING'} onClick={() => onClickBet(5)} className='w-16 drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)] disabled:opacity-50 hover:enabled:animate-infinite hover:enabled:animate-pulse '><img src={Chip5} alt='Chip5' /></button>
                        <button disabled={lobbyData?.phase !== 'BETTING'} onClick={() => onClickBet(10)} className='w-16 drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)] disabled:opacity-50 hover:enabled:animate-infinite hover:enabled:animate-pulse'><img src={Chip10} alt='Chip10' /></button>
                        <button disabled={lobbyData?.phase !== 'BETTING'} onClick={() => onClickBet(20)} className='w-16 drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)] disabled:opacity-50 hover:enabled:animate-infinite hover:enabled:animate-pulse'><img src={Chip20} alt='Chip20' /></button>
                        <button disabled={lobbyData?.phase !== 'BETTING'} onClick={() => onClickBet(50)} className='w-16 drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)] disabled:opacity-50 hover:enabled:animate-infinite hover:enabled:animate-pulse'><img src={Chip50} alt='Chip50' /></button>
                        <button disabled={lobbyData?.phase !== 'BETTING'} onClick={() => onClickBet(100)} className='w-16 drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)] disabled:opacity-50 hover:enabled:animate-infinite hover:enabled:animate-pulse'><img src={Chip100} alt='Chip100' /></button>
                        <button disabled={lobbyData?.phase !== 'BETTING'} onClick={() => onClickBet(500)} className='w-16 drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)] disabled:opacity-50 hover:enabled:animate-infinite hover:enabled:animate-pulse'><img src={Chip500} alt='Chip500' /></button>
                    </div>
                </div>
            </div>
        </>

    )
}
