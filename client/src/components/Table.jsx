import React, { useContext, useMemo } from 'react';
import { SocketContext } from '../context/SocketProvider.js';
import Card from './Card';

export default function Table(props) {
    const { lobbyData, emitAction } = useContext(SocketContext);

    const onClickStart = (index) => {
        emitAction('startRound', lobbyData.lobbyId);
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
            <div>{props.tableCardsValue}</div>

            <div className='w-1/2 relative'>
                {lobbyData?.table?.tableCards.map((card, index) => {
                    return <div style={{ position: 'absolute', left: `calc(50% - ${index}*2rem)`, top: `calc(40% + ${index}*2rem)`, transform: `translate(-50%, -50%)` }}>
                        {lobbyData.table.tableCards[index] ? <Card card={card} /> : <></>}
                    </div>
                })}
                {/* <div className='absolute left-[calc(50%)] top-[calc(40%)] transform -translate-x-1/2 -translate-y-1/2'>
                    <Card card={lobbyData?.table?.tableCards[0]} />
                </div>
                <div className='absolute left-[calc(50%-2rem)] top-[calc(40%+2rem)] transform -translate-x-1/2 -translate-y-1/2'>
                    {lobbyData.table.tableCards[1] ? <Card card={lobbyData.table.tableCards[1]} /> : <Card card={0} />}
                </div>
                <div className='absolute left-[calc(50%-4rem)] top-[calc(40%+4rem)] transform -translate-x-1/2 -translate-y-1/2'>
                    {lobbyData.table.tableCards[2] ? <Card card={lobbyData.table.tableCards[2]} /> : <></>}
                </div> */}
                {calculation}
            </div>
            <div className='flex gap-12 items-center '>
                <button className='border-black border-2' onClick={onClickStart} >Start</button>
                <button className='border-black border-2' onClick={onClickDealCard} >Deal</button>
            </div>
        </div >
    )
}
