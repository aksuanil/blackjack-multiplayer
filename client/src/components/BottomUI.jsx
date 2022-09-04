import React from 'react'
import Chip5 from '../assets/images/5.svg'
import Chip10 from '../assets/images/10.svg'
import Chip20 from '../assets/images/20.svg'
import Chip50 from '../assets/images/50.svg'
import Chip100 from '../assets/images/100.svg'
import Chip500 from '../assets/images/500.svg'

const css = `
.curve {
    color: white;
    position: relative;
    overflow: hidden;
    text-align: center;
    width: 100%;
    z-index: 2;
  }
 .curve::before {
    content: '';
    display: block;
    background: brown;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    border-radius: 150vw;
    width: 325vw;
    height: 300vw;
    z-index: -1;
    border: 2px solid black;
  }
`

export default function BottomUI() {
    return (
        <>
            <style>{css}</style>
            <div className='curve bg-green-800 flex items-center'>
                <div className='flex flex-col w-1/3 items-end p-10'>
                    <div className=''>Cash: 1200 $</div>
                    <div className=''>Bet: 200 $</div>
                </div>
                <div className='flex gap-12 w-1/3 justify-center p-4'>
                    <button className='border-2 border-black rounded-full p-6'>HIT</button>
                    <button className='border-2 border-black rounded-full p-6 px-4'>PASS</button>
                    <button className='border-2 border-black rounded-full p-6'>HIT</button>
                </div>
                <div className='flex w-1/4 gap-4 self-end pt-8 pb-4'>
                    <button className='w-20 drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)] '><img src={Chip5} /></button>
                    <button className='w-20 drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)]'><img src={Chip10} /></button>
                    <button className='w-20 drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)]'><img src={Chip20} /></button>
                    <button className='w-20 drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)]'><img src={Chip50} /></button>
                    <button className='w-20 drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)]'><img src={Chip100} /></button>
                    <button className='w-20 drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)]'><img src={Chip500} /></button>
                </div>
            </div>
        </>

    )
}
