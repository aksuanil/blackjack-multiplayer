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
        props.setPlayerSeatIndex(index)
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
        if (lobbyData?.phase === 'PLAYING' && cardsValue > 21) {
            emitAction('setBusted', lobbyData.lobbyId, { seatId: props.index, isBusted: true });
        }
        else if (lobbyData?.phase === 'PLAYING' && cardsValue === 21) {
            console.log('test1')
            emitAction('addCash', lobbyData.lobbyId, { seatId: props.index, cashAmount: lobbyData?.seats[props.index]?.currentBet * 2.5 });
        }
        else if (lobbyData?.phase === 'ROUND_END' && tableCardsValue > 21) {
            console.log('test2')
            emitAction('addCash', lobbyData.lobbyId, { seatId: props.index, cashAmount: lobbyData?.seats[props.index]?.currentBet * 2.5 });
        }
        else if (lobbyData?.phase === 'ROUND_END' && cardsValue > tableCardsValue && !lobbyData?.seats[props.index]?.isBusted) {
            console.log('test3')
            emitAction('addCash', lobbyData.lobbyId, { seatId: props.index, cashAmount: lobbyData?.seats[props.index]?.currentBet * 2.5 });
        }
        else if (lobbyData?.phase === 'ROUND_END' && tableCardsValue <= 21 && cardsValue !== 0) {
            emitAction('setBusted', lobbyData.lobbyId, { seatId: props.index, isBusted: true });
        }
    }, [cardsValue, tableCardsValue])

    return (
        <div className={lobbyData?.seats[props.index]?.isTurn ? 'flex flex-col w-1/4 px-6 pb-6 h-full justify-end relative bg-gradient-to-b from-transparent bg-opacity-50 via-green-500 to-green-900' : 'flex flex-col w-1/4 px-6 pb-6 h-full justify-end relative'}>
            {lobbyData?.seats[props.index]?.isTurn ? <TimerArrow /> : <div></div>}
            {lobbyData?.seats[props.index]?.isBusted ? <div className='flex justify-center text-red-900 font-bold text-xl bg-red-600'>BUSTED</div> : (lobbyData?.phase === 'ROUND_END' && lobbyData?.seats[props.index]?.status) && <div className='flex justify-center text-blue-900 font-bold text-xl bg-blue-600'>WON</div>}
            <div className='relative min-h-[140px]'>
                {lobbyData?.seats[props.index]?.cards?.map((card, index) => {
                    return <div className="shadow-[-6px_0px_8px_-2px_rgba(0,0,0,0.2)] shadow-black rounded-md animate-flipInY" style={{ position: 'absolute', right: `calc(40% - ${index}*2rem)`, animationDelay: `${index <= 1 && index * 1000}ms` }}>
                        <Card key={index} card={card} />
                    </div>
                })}
            </div>
            {cardsValue > 0 ? <div className='text-center border-b-2 border-black p-1 mx-auto m-2 font-bold'>{cardsValue}</div> : <div></div>}
            {lobbyData?.seats[props.index]?.socketId === socket.id
                ?
                <div className='flex justify-around text-zinc-300 font-semibold text-lg tracking-wider py-1 mt-8 rounded-md border-2 border-stone-900' style={{ backgroundColor: '#171a1f', backgroundImage: '-webkit-linear-gradient(-30deg, #AD1D00 65%, #E02500 35%)' }}>
                    {lobbyData?.seats[props.index]?.name || "TEST NAME"}
                </div>
                : lobbyData?.seats[props.index]?.status ?
                    <div className='flex flex-col'>
                        <div className='flex justify-around font-semibold text-lg rounded-t-md border-2 border-b-0 border-stone-800 bg-zinc-700 w-3/4 self-center' >
                            <div>
                                {lobbyData?.seats[props.index]?.cash}$
                            </div>
                            <div>
                                Bet: {lobbyData?.seats[props.index]?.currentBet}$
                            </div>
                        </div>
                        <div className='flex justify-around text-gray-400 font-semibold text-lg tracking-wider py-1 rounded-md border-2 border-stone-900' style={{ backgroundColor: '#171a1f', backgroundImage: '-webkit-linear-gradient(-30deg, #1a1e24 65%, #2c313b 35%)' }}>
                            <div>
                                {lobbyData?.seats[props.index]?.name || "TEST NAME"}
                            </div>
                        </div>
                    </div>
                    : props.isSeated === false ?
                        <button onClick={() => onClickSeat(props.index)} className='border-2 border-gray-900 rounded-lg text-6xl font-bold bg-red-900 bg-opacity-80 hover:bg-opacity-100'>+</button>
                        :
                        <div className='border-2 border-gray-900 py-4 text-center rounded-lg'>EMPTY</div>
            }
        </div>
    )
}


