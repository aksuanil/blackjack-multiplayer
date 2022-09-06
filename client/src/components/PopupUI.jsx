import React, { useEffect, useState } from 'react';

export default function PopupUI(props) {
    const [message, setMessage] = useState('');

    useEffect(() => {
        setMessage(props.message);
    }, [props.message])

    return (
        <>
            {message && <div>{message}</div>}
        </>
    )
}
