import React from 'react';

export default function Seat(props) {
    const isFilled = props.isFilled;
    const index = props.index;
    return (
        <>
            {isFilled
                ?
                <button onClick={() => props.getSeatDispatch({ isFilled: false, seatIndex: index })} className='font-bold text-3xl border-black border-2'>PLAYER INFO</button>
                :
                <button onClick={() => props.getSeatDispatch({ isFilled: true, seatIndex: index })} className='font-bold text-6xl border-black border-2'>+</button>
            }
        </>
    )
}
