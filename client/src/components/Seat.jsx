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
        props.setSeatNumber(index)
    }
    const onClickUnseat = (index) => {
        emitAction('getUnseated', lobbyData.lobbyId, { seatId: index });
        props.setIsSeated(false)
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
            {cardsValue > 0 ? <div className='text-center border-b-2 border-black p-1 mx-auto mb-4 font-bold'>{cardsValue}</div> : <div></div>}
            {lobbyData?.seats[props.index]?.isBusted ? <div className='flex justify-center text-red-900 font-bold text-xl bg-red-600'>BUSTED</div> : <div></div>}
            <div className='relative h-full'>
                {lobbyData?.seats[props.index]?.cards?.map((card, index) => {
                    return <div className='shadow-[-6px_0px_8px_-2px_rgba(0,0,0,0.2)] shadow-black rounded-md' style={{ position: 'absolute', right: `calc(40% - ${index}*2rem)` }}>
                        <Card key={index} card={card} />
                    </div>

                })}
            </div>
            {lobbyData?.seats[props.index]?.socketId === socket.id
                ?
                <div className='flex flex-col bg-yellow-900 border-black border-2 rounded-md'>
                    <div className='flex justify-around font-bold text-3xl '>
                        <div>
                            {lobbyData?.seats[props.index]?.name || "TEST NAME"}
                        </div>
                    </div>
                </div>
                : lobbyData?.seats[props.index]?.status ?
                    <div className='flex flex-col'>
                        <div className='flex justify-around text-xl bg-yellow-800 rounded-t-md items-center h-10'>
                            <div>
                                Cash: {lobbyData?.seats[props.index]?.cash}$
                            </div>
                            <div>
                                Bet: {lobbyData?.seats[props.index]?.currentBet}$
                            </div>
                        </div>
                        <div className='flex justify-around font-bold text-3xl border-black border-2'>
                            <div>
                                {lobbyData?.seats[props.index]?.name || "TEST NAME"}
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


