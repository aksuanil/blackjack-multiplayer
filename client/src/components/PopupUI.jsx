import React, { useEffect, useState } from 'react';

export default function PopupUI(props) {
    const [isShow, setIsShow] = useState(true);

    useEffect(() => {
        const closeTimeout = setTimeout(() => {
            setIsShow(false)
            props.messageCallback('');
        }, 3000)
        return () => {
            clearTimeout(closeTimeout)
        }
    }, []);

    if (!isShow) {
        return null;
    }

    return (
        <div className='p-2 rounded-md bg-red-600 bg-opacity-70 border-2 border-gray-600 font-semibold tracking-wide text-white'>{props.message}</div>
    )
}
