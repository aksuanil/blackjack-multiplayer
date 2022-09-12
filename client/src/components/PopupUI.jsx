import React from 'react';
import usePopup from '../hooks/usePopup';

export default function PopupUI({ message, messageCallback }) {
    usePopup({ messageCallback })

    return (
        <div className='p-2 rounded-md bg-red-600 bg-opacity-70 border-2 border-gray-600 font-semibold tracking-wide text-white'>{message}</div>
    )
}
