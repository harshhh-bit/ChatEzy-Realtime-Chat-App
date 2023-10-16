const socket = io();

const form = document.querySelector('#send-form');
const msg_inp = document.querySelector('#msg-inp');
const msg_container = document.querySelector('.container');

const audio = new Audio('incoming_message_audio.mp3');

const name = prompt('Enter your name to join');

const append = (message, position) => {
    const msg_element = document.createElement('section');

    msg_element.innerText = message;

    msg_element.classList.add('message');
    msg_element.classList.add(position);

    msg_container.append(msg_element);

    if(position == 'left')
        audio.play();
}

socket.emit('new-user-joined', name);

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'left');
});


form.addEventListener('submit', e => {
    e.preventDefault();

    const message = msg_inp.value;
    append(`You: ${message}`, 'right');
    msg_inp.value = "";

    socket.emit('send', message);
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', name => {
    append(`${name} left the chat`, left);
})