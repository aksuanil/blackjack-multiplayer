import React, { useContext, useEffect, useMemo } from 'react';
import { SocketContext } from '../context/SocketProvider.js';
import { cardValues } from '../helpers/cardHelpers.js';
import Card from './Card';

let tableCardsValue = 0;

export default function Table() {
    const { lobbyData, emitAction } = useContext(SocketContext);

    useEffect(() => {
        lobbyData?.table?.tableCards?.map((card) => {
            tableCardsValue += cardValues[card]?.value;
        })
    }, [JSON.stringify(lobbyData.table.tableCards)])

    const onClickStart = (index) => {
        emitAction('startBetPhase', lobbyData.lobbyId);
    }
    const onClickDealCard = (index) => {
        emitAction('startRound', lobbyData.lobbyId);
    }

    const getDeck = () => {
        let deck = [];
        for (let i = 0; i <= 32; i++) {
            deck.push(<div className='absolute left-[calc(80%)] top-[calc(30%)] transform -translate-x-1/2 -translate-y-1/2' style={{ paddingRight: `${(i * .1)}vh`, position: 'absolute', paddingTop: `${(i * .1)}vh` }}>
                <Card key={i} card={0} />
            </div>);
        }
        return deck;
    };
    const calculation = useMemo(() => getDeck(), []);

    return (
        <div className='bg-green-900 grow flex flex-row justify-center'>
            <div className='w-1/2 relative'>
                <div className='absolute left-[calc(50%)] top-[calc(40%)] transform -translate-x-1/2 -translate-y-1/2'>
                    <Card card={1} />
                </div>
                <div className='absolute left-[calc(50%-2rem)] top-[calc(40%+2rem)] transform -translate-x-1/2 -translate-y-1/2'>
                    <Card card={0} />
                </div>
                {calculation}
            </div>
            <div className='flex gap-12 items-center '>
                <button className='border-black border-2' onClick={onClickStart} >Start</button>
                <button className='border-black border-2' onClick={onClickDealCard} >Deal</button>
            </div>
        </div >
    )
}
