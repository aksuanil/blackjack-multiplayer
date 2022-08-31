import React, { useEffect, useState } from 'react';
import downArrow from '../assets/images/down-arrow.svg';

export default function TimerArrow() {
    const [timeLeft, setTimeLeft] = useState(10);

    useEffect(() => {
        const timerInterval = setInterval(() => {
            setTimeLeft((t) => t - 1);
        }, 1000);
        return () => clearInterval(timerInterval);
    }, []);

    return (
        <div className='absolute left-[calc(50%)] -top-1/4 w-12 transform -translate-x-1/2'>
            <div className='flex flex-col items-center'>
                <div>{timeLeft}</div>
                <img src={downArrow} alt='DownArrow' />
            </div>
        </div>
    )
}
