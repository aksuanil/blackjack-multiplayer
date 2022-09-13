
import React from 'react'

export default function Spinner() {
    return (
        <div className="absoulute flex flex-col items-center bg-black h-screen">
            <div className="w-40 h-40 mt-36 border-t-4 border-b-4 border-yellow-900 rounded-full animate-twSpin animate-infinite"></div>
            <div className="pt-5 animate-bounce text-white animate-twPulse animate-infinite">Loading...</div>
        </div>)
}