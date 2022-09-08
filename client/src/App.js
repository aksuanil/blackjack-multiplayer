import { BrowserRouter, Route, Routes } from "react-router-dom";
import GameLobby from './pages/GameLobby';
import Home from './pages/Home';

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="lobby/:lobbyId" element={<GameLobby />} />
        {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </BrowserRouter>

  );
}

export default App;


