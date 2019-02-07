var socket = io();

// SOCKET

socket.on('chat', function(msg) {
  renderMessageWhenSend('ltr', msg);
});

$(document).ready(function () {
  socket.on('welcome', function(msg) {
    console.log(msg);
  });

  $('body').on('click', '.send-button', function() {
    var msg = $('textarea#chatbox').val();
    msg = addLineBreak(msg);
    renderMessageWhenSend('rtl', msg);
    emitMessageToEveryone(msg);
  });
});

function addLineBreak(msg) {
  return msg.replace(/\r\n?|\n/g, '<br/>');
}

function renderMessageWhenSend(dir, msg) {
  $.ajax({
    type: "GET",
    url: "/show-sender-message",
    data: {dir: dir, msg: msg},
    success: function (response) {
      console.log(response);
      $('.conversation').append(response);
    }
  });
}

function emitMessageToEveryone(msg) {
  socket.emit('chat', msg);
}