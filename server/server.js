import express from 'express';
import http from 'http';
import { JSONFileSync, LowSync } from 'lowdb';
import { Server } from 'socket.io';
import { dbModel } from './dbModel.js';
const adapter = new JSONFileSync('db.json')
const db = new LowSync(adapter)
db.data ||= dbModel

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
});

// app.get('/', (req, res) => {
//     res.json({ message: "Welcome" });
// }
// );

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit("user-join", "user joined");
    socket.join("room1");

    socket.emit("onConnect", db.data.gameLobby.seats);

    socket.on("seat", async (data) => {
        console.log(db.data.gameLobby.seats[data.data.seatIndex])
        db.data.gameLobby.seats[data.data.seatIndex].status = data.data.isFilled;
        db.write();
        io.sockets.in("room1").emit("update", db.data.gameLobby.seats);
    }
    );
});



httpServer.listen(8080, () => {
    console.log('listening on *:8080');
});


