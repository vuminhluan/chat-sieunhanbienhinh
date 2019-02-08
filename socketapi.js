var io = require('socket.io')();
var socketAPI = {};

socketAPI.io = io;

io.on('connection', function(socket) {
  // console.log('Hello you, '+socket.id);
  io.to(socket.id).emit('welcome', 'Chào mừng bạn tới chatroom chúng tôi');

  socket.on('chat', function(msg) {
    // console.log(msg);
    socket.broadcast.emit('chat', msg);
  });

  socket.on('typing', function(enabled) {
    // console.log(msg);
    socket.broadcast.emit('typing', enabled);
  });
});



module.exports = socketAPI;
