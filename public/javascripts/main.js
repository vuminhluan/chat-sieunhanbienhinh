var socket = io();

// SOCKET

// except sender
socket.on('chat', function(msg) {
  renderMessageWhenSend('ltr', msg);
});

// except sender
socket.on('typing', function(show, socketID) {

  if (show) {
    if (!$('.typing-noty[data-id='+socketID+']')[0]) {
      var typingNoty = "<span data-id='"+socketID+"' data-remove-when-disconnect='"+socketID+"' class='typing-noty'>Ai đó đang trả lời...</span>";
      $('.someone-typing-noty').append(typingNoty);
    }
  } else {
    if ($('.typing-noty[data-id='+socketID+']')[0]) {
      $('.typing-noty[data-id='+socketID+']').remove();
    }
  }
});

$(document).ready(function () {
  $('textarea#chatbox').val('');

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

  $('body').on('keyup', 'textarea#chatbox', function() {
    var msg = $('textarea#chatbox').val();
    // console.log(msg);
    var show = false;
    if (msg != "") {
      show = true;
    }
    emitTypingStatus(show);
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
