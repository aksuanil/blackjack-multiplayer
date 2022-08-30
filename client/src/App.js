import { useEffect, useContext } from 'react';
import SeatSection from './components/SeatSection';
import Table from './components/Table';
import { SocketProvider, SocketContext } from './context/SocketProvider';
import { LobbyProvider } from './context/LobbyProvider';


function App() {
  const log = console.log('test1')
  const { onConnect, onUpdate } = useContext(SocketContext);

  onUpdate()
  useEffect(() => {
    onConnect();
  }, []);

  return (
    <div className='flex flex-col h-[100vh] overflow-hidden'>
      <Table />
      <SeatSection />
    </div>
  );
}

export default App;


