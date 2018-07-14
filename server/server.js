const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {generateLocationMessage} = require('./utils/message');
const {Users} = require('./utils/users');
const publicpath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
app.use(express.static(publicpath));

io.on('connection',(socket)=>{
  console.log('new user connected');
  socket.on('join',(params,callback)=>{
    if (!isRealString(params.name) || !isRealString(params.room)) {
       return callback("name and room name are required");
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,params.room);
    io.to(params.room).emit('updateUserList',users.getUserList(params.room))
    //send message to a new user
    socket.emit('newMessage',generateMessage('Admin','welcome to the chat app'));
    //send message to everyone except the new user in the room
    socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined`));
    callback();
  });
  //listen for new messages
  socket.on('createMessage',(message,callback)=>{
    var user = users.getUser(socket.id);
    if(user && isRealString(message.text)){
      //send the message to everyone
      io.to(user.room).emit('newMessage',generateMessage(user.name,message.text));

    }
    callback();
  });

  socket.on('createLocationMessage',(coords)=>{
    var user = users.getUser(socket.id);
    if(user){
    io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude,coords.longitude));
    }
  });
  socket.on('disconnect',()=>{
    var user = users.removeUser(socket.id);
    if(user){
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));
    }
  });
});
server.listen(port,()=>{
  console.log(`server running on port ${port}`);
});
