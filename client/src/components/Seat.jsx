/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import exit from '../assets/images/exit-icon.svg';
import { SocketContext } from '../context/SocketProvider.js';
import { cardValues } from '../helpers/cardHelpers.js';
import Card from './Card';
import TimerArrow from './TimerArrow.jsx';

export default function Seat(props) {


    const [cardsValue, setCardsValue] = useState(99)
    const { emitAction, lobbyData, socket } = useContext(SocketContext);

    const [tableCardsValue, setTableCardsValue] = useState(0)
    useEffect(() => {
        let tableValue = 0;
        lobbyData?.table?.tableCards?.forEach(element => {

        });
        lobbyData?.table?.tableCards?.map((card) => {
            tableValue += cardValues[card]
        })
        setTableCardsValue(tableValue)

    }, [JSON.stringify(lobbyData?.table?.tableCards)])

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
        let val = 0;
        lobbyData?.seats[props.index]?.cards?.map((card) => {
            setCardsValue(val += cardValues[card])
        })
        if (lobbyData?.seats[props.index]?.cards.length === 0) {
            setCardsValue(0)
        }
    }, [JSON.stringify(lobbyData?.seats[props.index]?.cards)])

    useEffect(() => {
        if (lobbyData.phase === 'playing' && cardsValue > 21) {
            emitAction('setBusted', lobbyData.lobbyId, { seatId: props.index, isBusted: true });
        }
        else if (lobbyData.phase === 'playing' && cardsValue === 21) {
            emitAction('addCash', lobbyData.lobbyId, { seatId: props.index, cashAmount: lobbyData?.seats[props.index]?.currentBet * 2.5 });
        }
        else if (lobbyData.phase === 'playing' && tableCardsValue > 21) {
            emitAction('addCash', lobbyData.lobbyId, { seatId: props.index, cashAmount: lobbyData?.seats[props.index]?.currentBet * 2.5 });
        }
        else if (lobbyData.phase === 'playing' && cardsValue > tableCardsValue) {
            emitAction('addCash', lobbyData.lobbyId, { seatId: props.index, cashAmount: lobbyData?.seats[props.index]?.currentBet * 2.5 });
        }
        else if (lobbyData.phase === 'playing' && tableCardsValue < 21 && cardsValue !== 0) {
            emitAction('setBusted', lobbyData.lobbyId, { seatId: props.index, isBusted: true });
        }
    }, [cardsValue, tableCardsValue])

    return (
        <div className='flex flex-col w-1/4 px-10 pb-10 h-full justify-end relative'>
            {lobbyData?.seats[props.index]?.isTurn ? <TimerArrow /> : <div></div>}
            {lobbyData?.seats[props.index]?.isBusted ? <div>BUSTED</div> : <div></div>}

            {lobbyData?.seats[props.index]?.socketId === socket.id
                ?
                <div className='flex flex-col'>
                    {lobbyData?.seats[props.index]?.cards?.map((card, index) => {
                        return <div style={{ position: 'absolute', right: `calc(30% - ${index}*2rem)`, top: `calc(25% - ${index}*2rem)`, transform: `translate(-50%, -50%)` }}>
                            <Card key={index} card={card} />
                        </div>

                    })}
                    <div className='text-center'>{cardsValue}</div>
                    <div className='flex justify-between text-xl bg-orange-700 rounded-r-2xl rounded-l-md items-center'>
                        <div>
                            Cash: {lobbyData?.seats[props.index]?.cash}$
                        </div>
                        <div>Bet: {lobbyData?.seats[props.index]?.currentBet}$</div>
                        <button onClick={() => onClickUnseat(props.index)} className='font-bold text-3xl bg-red-800 hover:bg-red-700 border-black border-2 rounded-t-xl p-1 w-10'>
                            <img src={exit} alt='Exit' />
                        </button>
                    </div>
                    {/* <button onClick={() => onClickUnseat(props.index)} className='font-bold text-3xl bg-red-800 border-black border-2'>LEAVE</button> */}
                    <div className='flex justify-around font-bold text-3xl border-black border-2'>
                        <div>
                            {lobbyData?.seats[props.index]?.name || "TEST NAME"}
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


