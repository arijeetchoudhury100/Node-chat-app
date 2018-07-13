const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message');
const {generateLocationMessage} = require('./utils/message');
const publicpath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(publicpath));

io.on('connection',(socket)=>{
  console.log('new user connected');

  //send message to a new user
  socket.emit('newMessage',generateMessage('Admin','welcome to the chat app'));

  //send message to everyone except the new user
  socket.broadcast.emit('newMessage',generateMessage('Admin','new user joined'));

  //listen for new messages
  socket.on('createMessage',(message,callback)=>{
    console.log('create message',message);
    callback();
    //send the message to everyone
    io.emit('newMessage',generateMessage(message.from,message.text));
  });

  socket.on('createLocationMessage',(coords)=>{
    io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));
  });
  socket.on('disconnect',()=>{
    console.log('user was disconnected');
  });
});
server.listen(port,()=>{
  console.log(`server running on port ${port}`);
});
