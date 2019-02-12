var io        = require('socket.io')();
var socketAPI = {};

socketAPI.io  = io;

var users     = {};

io.on('connection', function(socket) {
  // console.log('Hello you, '+socket.id);
  users[socket.id] = null;
  
  io.to(socket.id).emit('welcome', 'Chào mừng bạn tới chatroom chúng tôi');
  // io.emit('sendingUser', users);
  
  // Register nickname
  socket.on('register', function(nickname) {
    users[socket.id] = nickname;
    io.emit('sendingUser', users);
    socket.broadcast.emit('newUserAnnouncement', nickname);
  });

  socket.on('chat', function(msg, nickname) {
    // console.log(msg);
    socket.broadcast.emit('chat', msg, nickname);
  });

  // socket.on('typing', function(show) {
  //   // console.log(msg);
  //   socket.broadcast.emit('typing', show, socket.id, users[socket.id]);
  // });



  // disconnect event
  socket.on('disconnect', function() {
    delete users[socket.id];
    io.emit('sendingUser', users);
  });
});



module.exports = socketAPI;
