const messageList = document.querySelector("ul");
const nameForm = document.querySelector("#name");
const messageForm = document.querySelector("#chat");

const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload){
    const msg = {type, payload};
    return JSON.stringify(msg);
}

// Connect
socket.addEventListener("open", () => {
    console.log("Connected to Server");
});

// Display message
socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerHTML = message.data;
    messageList.append(li);
    // console.log("Server : " + message.data);
});

// Disconnect
socket.addEventListener("close", () => {
    console.log("Disconnect to Server");
});

//채팅 Form
function handleSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("chat", input.value));
    input.value = "";
}

//이름 Form
function handleNameSubmit(event) {
    event.preventDefault();
    const input = nameForm.querySelector("input");
    socket.send(makeMessage("name", input.value));
}

nameForm.addEventListener("submit", handleNameSubmit);
messageForm.addEventListener("submit", handleSubmit);
