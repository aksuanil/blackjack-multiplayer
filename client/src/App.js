import { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import SeatSection from './components/SeatSection';
import Table from './components/Table';
const socket = io("http://localhost:8080");

function App() {
  const states = { 0: "Disconnected", 1: "Connected", 2: "Seated", 3: "Playing" };

  const [userState, setUserState] = useState(states[0]);
  const [isSeatFilled, setIsSeatFilled] = useState([true, false, false, false]);

  const getSeatDispatch = (seatData) => {
    socket.emit("seat", { data: seatData });
  }

  socket.on("update", (seatData) => {
    setIsSeatFilled(seatData);
  });

  useEffect(() => {
    socket.on("connect", () => {
      setUserState(states[1]);
    });
    socket.on("onConnect", (seatData) => {
      setIsSeatFilled(seatData);
    });
  }, []);

  return (
    <div className='flex flex-col h-[100vh]'>
      <Table />
      <SeatSection seatStatus={isSeatFilled} getSeatDispatch={getSeatDispatch} />
    </div>
  );
}

export default App;


