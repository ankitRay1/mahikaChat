const socket = io('http://localhost:8000');


// get DOM elements in  respective JS variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

//audio play on receiving msg
var audio = new Audio('Ting.mp3');

//append message to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }
}

//ask name from user
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

//if new user joins, receive name from server
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
})

//receive the msg send by a server
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
})

//append the information about the user left the chat
socket.on('left', name => {
    append(`${name} left the chat`, 'right');
})

//if form get submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})