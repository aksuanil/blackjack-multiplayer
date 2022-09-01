import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../context/SocketProvider.js';
import { cardValues } from '../helpers/cardHelpers.js';
import Card from './Card';
import TimerArrow from './TimerArrow.jsx';

export default function Seat(props) {
    let [cardsValue, setCardsValue] = useState(0)
    const { emitAction, lobbyData, socket } = useContext(SocketContext);
    const onClickSeat = (index) => {
        emitAction('getSeated', lobbyData.lobbyId, { seatId: index, socketId: socket.id, name: 'test name' });
        props.setIsSeated(true)
    }
    const onClickUnseat = (index) => {
        emitAction('getUnseated', lobbyData.lobbyId, { seatId: index });
        props.setIsSeated(false)
    }
    const onClickHit = (index) => {
        emitAction('addCard', lobbyData.lobbyId, { seatId: index });
    }
    const onClickPass = (index) => {
        //
    }
    const onClickBet = (betAmount) => {
        emitAction('setBet', lobbyData.lobbyId, { seatId: props.index, betAmount: betAmount });
    }
    useEffect(() => {
        if (cardsValue > 21) {
            // busted
            emitAction('setBusted', lobbyData.lobbyId, { seatId: props.index, isBusted: true });
        }
        else if (cardsValue === 21) {
            emitAction('addCash', lobbyData.lobbyId, { seatId: props.index, cashAmount: lobbyData?.seats[props.index]?.currentBet * 2.5 });
        }
        else if (lobbyData.phase === 'playing' && (cardsValue > props.tableCardsValue)) {
            emitAction('addCash', lobbyData.lobbyId, { seatId: props.index, cashAmount: lobbyData?.seats[props.index]?.currentBet * 2.5 });
        }
        else if (lobbyData.phase === 'playing' && props.tableCardsValue < 21 && cardsValue !== 0) {
            emitAction('setBusted', lobbyData.lobbyId, { seatId: props.index, isBusted: true });
        }
        if (lobbyData.phase === 'playing' && props.tableCardsValue > 21) {
            emitAction('setTableBusted', lobbyData.lobbyId, { seatId: props.index, isBusted: true });
        }
    }, [cardsValue, props.tableCardsValue])

    useEffect(() => {
        let val = 0;
        lobbyData?.seats[props.index]?.cards?.map((card) => {
            setCardsValue(val += cardValues[card])
        })
        if (lobbyData?.seats[props.index]?.cards.length === 0) {
            setCardsValue(0)
        }
    }, [JSON.stringify(lobbyData?.seats[props.index]?.cards)])

    return (
        <div className='flex flex-col w-1/4 px-10 pb-10 h-full justify-end relative'>
            {lobbyData?.seats[props.index]?.isTurn ? <TimerArrow /> : <div></div>}
            {lobbyData?.seats[props.index]?.isBusted ? <div>BUSTED</div> : <div></div>}

            {lobbyData?.seats[props.index]?.socketId === socket.id
                ?
                <div className='flex flex-col'>
                    <div className='flex justify-around'>
                        <div>{cardsValue}</div>
                        <div>{lobbyData?.seats[props.index]?.currentBet}</div>
                    </div>
                    {lobbyData?.seats[props.index]?.cards?.map((card, index) => {
                        return <div style={{ position: 'absolute', right: `calc(30% - ${index}*2rem)`, top: `calc(25% - ${index}*2rem)`, transform: `translate(-50%, -50%)` }}>
                            <Card key={index} card={card} />
                        </div>

                    })}
                    <button onClick={() => onClickUnseat(props.index)} className='font-bold text-3xl bg-red-800 border-black border-2'>LEAVE</button>
                    <div className='flex justify-around font-bold text-3xl border-black border-2'>
                        <div>
                            {lobbyData?.seats[props.index]?.name}
                        </div>
                        <div>
                            {lobbyData?.seats[props.index]?.cash} $
                        </div>
                    </div>
                    {(lobbyData?.phase === 'betting' && lobbyData?.seats[props.index]?.isTurn && !lobbyData?.seats[props.index]?.isBusted) ?
                        <div className='grid grid-cols-3'>
                            <button onClick={() => onClickBet(10)} className='border-2 border-black'>5</button>
                            <button onClick={() => onClickBet(10)} className='border-2 border-black'>10</button>
                            <button onClick={() => onClickBet(20)} className='border-2 border-black'>20</button>
                            <button onClick={() => onClickBet(50)} className='border-2 border-black'>50</button>
                            <button onClick={() => onClickBet(100)} className='border-2 border-black'>100</button>
                            <button onClick={() => onClickBet(200)} className='border-2 border-black'>200</button>
                        </div> : null
                    }
                    {(lobbyData?.phase === 'playing' && lobbyData?.seats[props.index]?.isTurn && !lobbyData?.seats[props.index]?.isBusted) ?
                        <div className='flex justify-evenly'>
                            <button onClick={() => onClickHit(props.index)} className='grow border-2 border-black bg-blue-600'>HIT</button>
                            <button onClick={() => onClickPass(props.index)} className='grow border-2 border-black bg-yellow-700'>PASS</button>
                        </div> : null
                    }
                </div>
                : lobbyData?.seats[props.index]?.status ?
                    <div className='flex flex-col'>
                        {lobbyData?.seats[props.index]?.cards?.map((card, index) => {
                            return <div style={{ position: 'absolute', right: `calc(30% - ${index}*2rem)`, top: `calc(25% - ${index}*2rem)`, transform: `translate(-50%, -50%)` }}>
                                <Card key={index} card={card} />
                            </div>

                        })}
                        <div className='flex justify-around'>
                            <div>{cardsValue}</div>
                            <div>Bet: {lobbyData?.seats[props.index]?.currentBet}</div>
                        </div>
                        <div className='flex flex-col text-center gap-4 p-2 font-bold text-3xl border-black border-2'>
                            <div>
                                {lobbyData?.seats[props.index]?.name}
                            </div>
                            <div>
                                {lobbyData?.seats[props.index]?.cash} $
                            </div>
                        </div>
                    </div>
                    : props.isSeated === false ?
                        <button onClick={() => onClickSeat(props.index)} className='font-bold text-6xl border-black border-2'>+</button>
                        :
                        <div>EMPTY</div>
            }
        </div>
    )
}


