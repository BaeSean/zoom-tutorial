const socket = io();
const door = document.getElementById("door");
const doorForm = door.querySelector("form");

const room = document.getElementById("room");
const messageForm = room.querySelector("#message");
const nameForm = room.querySelector("#name");


let roomName;

room.hidden = true;

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function showRoom() {
    door.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = roomName;

    messageForm.addEventListener("submit", handleMessageSubmit);
    nameForm.addEventListener("submit", handleNameSubmit);
}


function handleNameSubmit(event) {
    event.preventDefault();
    const input = nameForm.querySelector("input");
    const text = input.value;
    socket.emit("nickname", roomName, text);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    const text = input.value;
    socket.emit("new_message", roomName, text, () => {
        addMessage(`You : ${text}`);
    });
    input.value = "";
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = doorForm.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

doorForm.addEventListener("submit", handleRoomSubmit);



socket.on("joined", (nickname) => {
    addMessage(`${nickname} joined!`);
})

socket.on("new_message", addMessage);

socket.on("leave", (nickname) => {
    addMessage(`${nickname} left!`);
})
