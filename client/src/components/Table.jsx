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
            deck.push(<div className='absolute left-[calc(80%)] top-[calc(55%)] transform -translate-x-1/2 -translate-y-1/2' style={{ paddingRight: `${(i * .1)}vh`, position: 'absolute', paddingTop: `${(i * .1)}vh` }}>
                <Card key={i} card={0} />
            </div>);
        }
        return deck;
    };
    const calculation = useMemo(() => getDeck(), []);

    return (
        <div className='grow flex justify-center items-end h-2/5 relative'>
            <div className='w-1/2 '>
                {lobbyData?.table?.tableCards.map((card, index) => {
                    return <div className='shadow-[-6px_0px_10px_-2px_rgba(0,0,0,0.2)] shadow-black rounded-md' style={{ position: 'absolute', right: `calc(50% - ${index}*3rem)`, bottom: `calc(20% )` }}>
                        {lobbyData.table.tableCards[index] ? <Card card={card} /> : <></>}
                    </div>
                })}
                {props.tableCardsValue !== 0 ? <div className='text-center border-b-2 border-black p-1 mx-auto font-bold w-10'>{props.tableCardsValue}</div> : null}
                {calculation}
            </div>
            {/* <div className='flex gap-12 items-center '>
                <button className='border-black border-2' onClick={onClickStart} >Start</button>
                <button className='border-black border-2' onClick={onClickDealCard} >Deal</button>
            </div> */}
        </div >
    )
}
