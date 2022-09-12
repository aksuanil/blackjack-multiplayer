import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SocketProvider } from './context/SocketProvider';
import GameLobby from './pages/GameLobby';
import Home from './pages/Home';

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="lobby/:lobbyId"
          element={
            <SocketProvider>
              <GameLobby />
            </SocketProvider>
          } />
      </Routes>
      {/* <Route path="*" element={<NoPage />} /> */}
    </BrowserRouter>

  );
}

export default App;


