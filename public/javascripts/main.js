var socket = io();

// SOCKET

// except sender
socket.on('chat', function(msg) {
  renderMessageWhenSend('ltr', msg);
});

// except sender
socket.on('typing', function(enabled) {
  if (enabled) {
    var p = "<p class='typing-noty'>Someone is typing...</p>";
    $('.conversation').append(p);
  } else {
    $('.typing-noty').remove();
  }
});

$(document).ready(function () {
  socket.on('welcome', function(msg) {
    console.log(msg);
  });

  $('body').on('click', '.send-button:not(.disabled)', function() {
    var msg = $('textarea#chatbox').val();
    if (msg != "") {
      msg = addLineBreak(msg);
      renderMessageWhenSend('rtl', msg);
      emitMessageToEveryone(msg);
    }
  });

  $('body').on('keyup', '.send-button:not(.disabled)', function() {
    var msg = $('textarea#chatbox').val();
    var enabled = false;
    if (msg != "") {
      enabled = true;
    }
    emitTypingStatus(enabled);
  });
});

function addLineBreak(msg) {
  return msg.replace(/\r\n?|\n/g, '<br/>');
}

function renderMessageWhenSend(dir, msg) {
  changeSendingButtonStatus();
  $.ajax({
    type: "GET",
    url: "/show-sender-message",
    data: {dir: dir, msg: msg},
    success: function (response) {
      // console.log(response);
      $('.conversation').append(response);
      clearMessageBox();
      changeSendingButtonStatus();
    }
  });
}

function emitMessageToEveryone(msg) {
  socket.emit('chat', msg);
}

function clearMessageBox() {
  $('textarea#chatbox').val('');
}

function changeSendingButtonStatus() {
  $('.send-button').toggleClass('disabled');
}

function emitTypingStatus(enabled) {
  socket.emit('typing', enabled);
}
