import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
// app.get("/*", (req, res) => res.render("home"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
// app.listen(3000, handleListen);

//같은 서버(포트)에서 http, websocket 실행
const server = http.createServer(app); //http server
const wss = new WebSocket.Server({ server }); //websocket server

const sockets = [];


// connect start
wss.on("connection", (socket) => {
    sockets.push(socket);   // User list
    socket["nickname"] = "익명";    

    console.log("Connected to Browser");

    // disconnect
    socket.on("close", () => {
        console.log("Disconnect from the Browser");
    })

    // message
    socket.on("message", message => {
        const msgObj = JSON.parse(message.toString());

        if (msgObj.type === "chat") {
            sockets.forEach(user => user.send(
                `${socket.nickname} : ${msgObj.payload}`
            ));
        }
        else if (msgObj.type === "name") {
            console.log(msgObj.payload)
            socket["nickname"] = msgObj.payload;
        }
    });
});

server.listen(3000, handleListen);