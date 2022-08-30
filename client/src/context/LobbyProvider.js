// import React, { createContext, useState } from "react";

// const LobbyContext = createContext(undefined);
// const LobbyDispatchContext = createContext(undefined);

// function LobbyProvider({ children }) {
//     const [lobbyData, setLobbyData] = useState({
//         lobbyId: "",
//         seats: [
//             { id: 0, name: "", status: false, cash: 200, cards: [] },
//             { id: 1, name: "", status: false, cash: 200, cards: [] },
//             { id: 2, name: "", status: false, cash: 200, cards: [] },
//             { id: 3, name: "", status: false, cash: 200, cards: [] },
//         ],
//         table: {
//             cards: [],
//             currentPlayer: 0,
//             currentBet: 0,
//             currentBetPlayer: 0,
//             currentBetPlayerName: ""
//         }
//     });
    
//     return (
//         <LobbyContext.Provider value={lobbyData}>
//             <LobbyDispatchContext.Provider value={setLobbyData}>
//                 {children}
//             </LobbyDispatchContext.Provider>
//         </LobbyContext.Provider>
//     );
// }

// export { LobbyProvider, LobbyContext, LobbyDispatchContext };