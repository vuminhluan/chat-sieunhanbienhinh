var io        = require('socket.io')();
var socketAPI = {};

socketAPI.io  = io;

var users     = {};

io.on('connection', function(socket) {
  // console.log('Hello you, '+socket.id);
  io.to(socket.id).emit('welcome', 'Chào mừng bạn tới chatroom chúng tôi');

  socket.on('chat', function(msg) {
    // console.log(msg);
    socket.broadcast.emit('chat', msg);
  });

  socket.on('typing', function(show) {
    // console.log(msg);
    socket.broadcast.emit('typing', show, socket.id);
  });
});



module.exports = socketAPI;
