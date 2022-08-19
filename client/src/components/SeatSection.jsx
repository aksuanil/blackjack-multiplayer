import React, { useEffect } from 'react'
import Seat from './Seat'

export default function SeatSection(props) {
    const [seat1, seat2, seat3, seat4] = (props.seatStatus)
    console.log(seat1.status)

    return (
        <div className='flex justify-around items-center bg-green-800 h-64'>
            <Seat index={0} isFilled={seat1.status} getSeatDispatch={props.getSeatDispatch} />
            <Seat index={1} isFilled={seat2.status} getSeatDispatch={props.getSeatDispatch} />
            <Seat index={2} isFilled={seat3.status} getSeatDispatch={props.getSeatDispatch} />
            <Seat index={3} isFilled={seat4.status} getSeatDispatch={props.getSeatDispatch} />
        </div>
    )
}
