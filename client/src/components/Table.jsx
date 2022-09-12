import React, { useContext, useMemo } from 'react';
import cardDeck2 from '../assets/images/cardDeck2.png';
import MessageContainer from '../components/MessageContainer';
import { SocketContext } from '../context/SocketProvider.js';
import Card from './Card';
export default function Table(props) {
    const { lobbyData } = useContext(SocketContext);

    // const getDeck = () => {
    //     let deck = [];
    //     for (let i = 0; i <= 32; i++) {
    //         deck.push(<div key={i} className='absolute left-[calc(80%)] top-[calc(55%)] transform -translate-x-1/2 -translate-y-1/2' style={{ paddingRight: `${(i * .1)}vh`, position: 'absolute', paddingTop: `${(i * .1)}vh` }}>
    //             <Card key={i} card={52} />
    //         </div>);
    //     }
    //     return deck;
    // };
    // const calculation = useMemo(() => getDeck(), []);

    return (
        <div className='grow flex justify-between items-end h-2/5 relative'>
            <div className='w-1/2 h-full'>
                <MessageContainer />
            </div>
            <div className='w-1/2 h-full'>
                {lobbyData?.table?.tableCards.map((card, index) => {
                    return <div key={index} className="shadow-[-6px_0px_10px_-2px_rgba(0,0,0,0.2)] shadow-black rounded-md animate-flipInY" style={{ position: 'absolute', right: `calc(45% - ${index}*3rem)`, bottom: `calc(15% )`, animationDelay: `${index * 500}ms` }}>
                        {lobbyData.table.tableCards[index] && <Card key={index} card={card} />}
                    </div>
                })}
                <img className='mx-auto drop-shadow-[5px_10px_15px_#000000]' src={cardDeck2} />
                {props.tableCardsValue !== 0 ? <div className='text-center border-b-2 border-black p-1 mx-auto font-bold w-10'>{props.tableCardsValue}</div> : null}
            </div>
            {/* {getDeck()} */}
        </div >
    )
}
