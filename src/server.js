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


wss.on("connection", (socket) => {
    console.log("Connected to Browser");
    socket.on("close", () => {
        console.log("Disconnect from the Browser");
    })
    socket.on("message", message => {
        console.log("Browser : " + message);
    });

    socket.send("Hi");
});

server.listen(3000, handleListen);