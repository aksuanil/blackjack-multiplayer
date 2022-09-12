import { useState, useEffect } from 'react'

export default function usePopup({ messageCallback }) {
    const [isShow, setIsShow] = useState(true);

    useEffect(() => {
        const closeTimeout = setTimeout(() => {
            setIsShow(false)
            messageCallback('');
        }, 3000)
        return () => {
            clearTimeout(closeTimeout)
        }
    }, []);

    if (!isShow) {
        return null;
    }
}
