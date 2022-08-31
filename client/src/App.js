import { useContext, useEffect } from 'react';
import SeatSection from './components/SeatSection';
import Table from './components/Table';
import { SocketContext } from './context/SocketProvider';


function App() {
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


