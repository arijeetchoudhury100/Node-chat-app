const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicpath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(publicpath));

io.on('connection',(socket)=>{
  console.log('new user connected');
  socket.on('createMessage',(message)=>{
    console.log('create message',message);
    io.emit('newMessage',{
      from : message.from,
      text : message.text,
      createdAt : new Date().getTime()
    });
  });

  socket.on('disconnect',()=>{
    console.log('user was disconnected');
  });
});
server.listen(port,()=>{
  console.log(`server running on port ${port}`);
});
