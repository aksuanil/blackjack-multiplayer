import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../context/SocketProvider.js';
import addCard from '../assets/images/addCard.svg';
import standIcon from '../assets/images/standIcon.svg';
import doubleIcon from '../assets/images/doubleIcon.svg';

import Chip5 from '../assets/images/5.svg'
import Chip10 from '../assets/images/10.svg'
import Chip20 from '../assets/images/20.svg'
import Chip50 from '../assets/images/50.svg'
import Chip100 from '../assets/images/100.svg'
import Chip500 from '../assets/images/500.svg'

export default function BottomUI(props) {
    const { emitAction, lobbyData, socket } = useContext(SocketContext);
    const onClickUnseat = (index) => {
        emitAction('getUnseated', lobbyData.lobbyId, { seatId: index });
        props.setIsSeated(false)
    }
    const onClickHit = (index) => {
        emitAction('addCard', lobbyData.lobbyId, { seatId: props.seatNumber });
    }
    const onClickPass = (index) => {
        //
    }
    const onClickBet = (betAmount) => {
        emitAction('setBet', lobbyData.lobbyId, { seatId: props.seatNumber, betAmount: betAmount });
    }
    return (
        <>
            <div className='curve bg-gradient-to-t from-yellow-900 via-yellow-700 to-yellow-900 flex items-center border-t-4 border-yellow-900 shadow-[0_35px_20px_35px_rgba(0,0,0,1)]'>
                <div className='flex w-1/3 justify-center gap-4 '>
                    <div className='bg-green-800  shadow-black shadow-inner rounded-xl px-4 py-1 text-xl font-semibold'>Cash: {lobbyData?.seats[props.seatNumber]?.cash}$</div>
                    <div className='bg-green-800  shadow-black shadow-inner rounded-xl px-4 py-1 text-xl font-semibold'>Bet: {lobbyData?.seats[props.seatNumber]?.currentBet}$</div>
                </div>

                {(lobbyData?.phase === 'playing' && lobbyData?.seats[props.seatNumber]?.isTurn && !lobbyData?.seats[props.seatNumber]?.isBusted)
                    ?
                    <div className='flex gap-12 w-1/3 justify-center p-4'>
                        <button className='border-2 border-black rounded-full font-bold w-20 shadow-black shadow-md  bg-green-800'><img className='w-8 mx-auto' src={doubleIcon} />DOUBLE</button>
                        <button onClick={() => onClickHit(props.seatNumber)} className='border-2 border-black rounded-full w-20 bg-red-700 hover:bg-red-600 shadow-black shadow-md  font-bold transition-all duration-200'><img className='w-10 mx-auto' src={addCard} />HIT</button>
                        <button className='border-2 border-black rounded-full h-20 w-20 bg-gradient-to-t from-yellow-800 via-yellow-500 to-yellow-800 shadow-black shadow-md font-bold'><img className='w-8 mx-auto' src={standIcon} />STAND</button>
                    </div>
                    :
                    <div className='flex gap-12 w-1/3 justify-center p-4'>
                        <button disabled className='border-2 border-black rounded-full w-20 bg-green-800 opacity-50 font-bold shadow-black shadow-inner'><img className='w-8 mx-auto' src={doubleIcon} />DOUBLE</button>
                        <button disabled className='border-2 border-black rounded-full w-20 bg-red-700 font-bold opacity-50 shadow-black shadow-inner'><img className='w-10 mx-auto' src={addCard} />HIT</button>
                        <button disabled className='border-2 border-black rounded-full h-20 w-20 bg-yellow-600 opacity-50 font-bold shadow-black shadow-inner'><img className='w-8 mx-auto' src={standIcon} />STAND</button>
                    </div>
                }
                <div className='flex w-1/3 gap-4'>
                    <button onClick={() => onClickBet(5)} className='w-16 drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)] '><img src={Chip5} alt='Chip5' /></button>
                    <button onClick={() => onClickBet(10)} className='w-16 drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)]'><img src={Chip10} alt='Chip10' /></button>
                    <button onClick={() => onClickBet(20)} className='w-16 drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)]'><img src={Chip20} alt='Chip20' /></button>
                    <button onClick={() => onClickBet(50)} className='w-16 drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)]'><img src={Chip50} alt='Chip50' /></button>
                    <button onClick={() => onClickBet(100)} className='w-16 drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)]'><img src={Chip100} alt='Chip100' /></button>
                    <button onClick={() => onClickBet(500)} className='w-16 drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)]'><img src={Chip500} alt='Chip500' /></button>
                </div>
            </div>
        </>

    )
}
