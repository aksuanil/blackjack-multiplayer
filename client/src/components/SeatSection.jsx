import React, { useState } from 'react'
import Seat from './Seat'

export default function SeatSection() {
    const [isSeated, setIsSeated] = useState(false)

    return (
        <div className='flex justify-around items-center bg-green-800 h-96'>
            <Seat key={0} index={0} isSeated={isSeated} setIsSeated={setIsSeated} />
            <Seat key={1} index={1} isSeated={isSeated} setIsSeated={setIsSeated} />
            <Seat key={2} index={2} isSeated={isSeated} setIsSeated={setIsSeated} />
            <Seat key={3} index={3} isSeated={isSeated} setIsSeated={setIsSeated} />
        </div>
    )
}
