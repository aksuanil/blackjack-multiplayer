import React from 'react'
import { cardImages } from '../helpers/cardHelpers.js'

export default function Card(props) {
    return (
        <img className='w-[100px] ' src={cardImages[props.card]} alt="Card" />
    )
}
