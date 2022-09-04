import { useContext, useEffect, useState } from 'react';
import BottomUI from './components/BottomUI';
import SeatSection from './components/SeatSection';
import Table from './components/Table';
import { SocketContext } from './context/SocketProvider';
import { cardValues } from './helpers/cardHelpers.js';

function App() {
  const { onConnect, onUpdate, lobbyData } = useContext(SocketContext);

  onUpdate()
  useEffect(() => {
    onConnect();
  }, []);

  const [tableCardsValue, setTableCardsValue] = useState(0)
  useEffect(() => {
    let tableValue = 0;
    lobbyData?.table?.tableCards?.map((card) => {
      tableValue += cardValues[card]
    })
    setTableCardsValue(tableValue)

  }, [JSON.stringify(lobbyData?.table?.tableCards)])
  return (
    <div className='flex flex-col h-[100vh] overflow-hidden'>
      <Table tableCardsValue={tableCardsValue} />
      <SeatSection tableCardsValue={tableCardsValue} />
      <BottomUI/>
    </div>
  );
}

export default App;


