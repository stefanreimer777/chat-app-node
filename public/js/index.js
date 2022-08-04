'use strict';
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL using qs.library
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
//console.log(username, room);

const socket = io.connect();

// Join chatroom by emiting username and room to server
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  // functions for dom-output
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submits
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;
  //console.log(msg);

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear message-input
  const emoji = document.querySelector('.emojionearea-editor');
  emoji.innerHTML = '';
  emoji.focus();

  // e.target.elements.msg.value = '';
  // e.target.elements.msg.focus();
});

// Output message to DOM
const outputMessage = (message) => {
  // Parent-element wird ausgewählt
  const parent = document.querySelector('#ausgabe');
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message');
  parent.append(messageContainer);

  const nameContainer = document.createElement('span');
  nameContainer.innerHTML = message.username;
  nameContainer.classList.add('username');
  messageContainer.append(nameContainer);

  messageContainer.classList.add('message');

  const timeContainer = document.createElement('span');
  timeContainer.innerHTML = message.time;
  timeContainer.classList.add('time');
  messageContainer.append(timeContainer);
  const lineBreak = document.createElement('br');
  messageContainer.append(lineBreak);

  messageContainer.innerHTML += message.text;
};

// Add room name to DOM
const outputRoomName = (room) => {
  roomName.innerText = room;
};

// Add users to DOM
const outputUsers = (users) => {
  //console.log(users);
  userList.innerHTML = '';
  for (let user of users) {
    //console.log(user);
    let listEl = document.createElement('li');
    listEl.innerHTML = user.username;
    userList.appendChild(listEl);
  }
};
