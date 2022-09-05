import { useContext, useEffect, useState } from 'react';
import BottomUI from './components/BottomUI';
import SeatSection from './components/SeatSection';
import Table from './components/Table';
import { SocketContext } from './context/SocketProvider';
import { cardValues } from './helpers/cardHelpers.js';
import tableArt from './assets/images/Table.jpg';

function App() {
  const { onConnect, onUpdate, lobbyData } = useContext(SocketContext);

  onUpdate()
  useEffect(() => {
    onConnect();
  }, []);

  const [tableCardsValue, setTableCardsValue] = useState(0)
  const [seatNumber, setSeatNumber] = useState(null)

  useEffect(() => {
    let tableValue = 0;
    lobbyData?.table?.tableCards?.map((card) => {
      tableValue += cardValues[card]
    })
    setTableCardsValue(tableValue)

  }, [JSON.stringify(lobbyData?.table?.tableCards)])
  return (
    <div className='flex flex-col h-[100vh] overflow-hidden' style={{ background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${tableArt})`, backgroundSize: 'cover' }}>
      <Table tableCardsValue={tableCardsValue} />
      <SeatSection tableCardsValue={tableCardsValue} setSeatNumber={setSeatNumber} />
      <BottomUI seatNumber={seatNumber} />
    </div>
  );
}

export default App;


