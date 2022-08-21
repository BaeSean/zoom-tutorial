import http from "http";
// import SocketIO from "socket.io";
import express from "express";
import {Server} from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

//같은 서버(포트)에서 http, socketio 실행
const httpServer = http.createServer(app); //http server
const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
    socket["nickname"] = "익명"; 

    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("joined", socket.nickname)
    });

    socket.on("nickname",(roomName, nickname) => {
        socket["nickname"] = nickname; 
    })

    socket.on("new_message", (roomName, message, done) => {
        socket.to(roomName).emit("new_message", `${socket.nickname} : ${message}`);
        done();
    })

    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => socket.to(room).emit("leave", socket.nickname));
    })
});



httpServer.listen(3000, handleListen);