const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message');
const publicpath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(publicpath));

io.on('connection',(socket)=>{
  console.log('new user connected');
  socket.emit('newMessage',generateMessage('Admin','welcome to the chat app'));
  socket.broadcast.emit('newMessage',generateMessage('Admin','new user joined'));
  socket.on('createMessage',(message)=>{
    console.log('create message',message);
    io.emit('newMessage',generateMessage(message.from,message.text));
  });

  socket.on('disconnect',()=>{
    console.log('user was disconnected');
  });
});
server.listen(port,()=>{
  console.log(`server running on port ${port}`);
});
