import React from 'react';
import Card from './Card';

export default function Table() {
    return (
        <div className='bg-green-900 grow flex flex-row justify-center pt-10 relative'>
            <div className='absolute left-1/3'>
                <Card />
            </div>
            <div className='absolute right-4 w-24'>
                <Card />
            </div>
        </div>
    )
}
