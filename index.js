'use strict';

require('dotenv').config();

var http = require('http');
const path = require('path');

const express = require("express");
const app = express();
const server = http.createServer(app);
const socketIO = require("socket.io");

const port = process.env.PORT || 8080;

const expressServer = app.listen(port, function () {
  console.error(`listening on port ${port}`);
});

if (process.env.PROD) {
  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, './client/build')));

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
  });
} else {
  app.use(express.static(path.resolve(__dirname, './client/public')));
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, './client/public', 'index.html'));
  });
}

const rooms = {};

var io = socketIO(expressServer);

io.sockets.on('connection', function(socket) {
  // convenience function to log server messages on the client
  function log() {
    var array = ['Message from server:'];
    array.push.apply(array, arguments);
    socket.emit('log', array);
  }

  socket.on('message', function(message) {
    log('Client said: ', message);
    // for a real app, would be room-only (not broadcast)
    socket.broadcast.emit('message', message);
  });

  socket.on("join room", roomID => {
    if (rooms[roomID]) {
        rooms[roomID].push(socket.id);
    } else {
        rooms[roomID] = [socket.id];
    }
    const otherUser = rooms[roomID].find(id => id !== socket.id);
    if (otherUser) {
        socket.emit("other user", otherUser);
        socket.to(otherUser).emit("user joined", socket.id);
    }
  });

  socket.on("offer", payload => {
    io.to(payload.target).emit("offer", payload);
  });

  socket.on("answer", payload => {
    io.to(payload.target).emit("answer", payload);
  });

  socket.on("ice-candidate", incoming => {
    io.to(incoming.target).emit("ice-candidate", incoming.candidate);
  });
});


// {
//   'iceServers': [
//     {
//       'urls': 'stun:stun.l.google.com:19302'
//     },
//   ]
// }
