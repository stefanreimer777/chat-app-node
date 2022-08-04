'use strict';

// Express
const express = require('express');
const expressServer = express();
expressServer.use(express.static('public'));
const formatMessage = require('./utils/messages');

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./utils/users');

// Http
const http = require('http');
const httpServer = http.Server(expressServer);

// Socket
const socketIo = require('socket.io');
const io = socketIo(httpServer);

const botName = 'Admin';

// Run when client connects
io.on('connect', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to Chat!'));

    // Broadcast when a user connects
    // broadcast means to all clients except the user thats connecting
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage, getting user from the socket.id
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);
    //console.log(msg);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = 4000 || process.env.PORT;
// Server starten
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
