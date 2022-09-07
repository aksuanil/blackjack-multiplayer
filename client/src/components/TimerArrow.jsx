import React, { useEffect, useState, useContext } from 'react';
import downArrow from '../assets/images/down-arrow.svg';
import { SocketContext } from '../context/SocketProvider.js';

export default function TimerArrow() {
    const { countdown } = useContext(SocketContext);

    return (
        <div className='absolute left-[calc(50%)] -top-[30%] w-12 transform -translate-x-1/2'>
            <div className='flex flex-col items-center'>
                <div className='text-center font-bold border-b-2 border-black rounded-full w-[36px] p-1 mx-auto mb-4'>{countdown}</div>
                <img src={downArrow} alt='DownArrow' />
            </div>
        </div>
    )
}
