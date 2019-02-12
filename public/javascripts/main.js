

var socket = io();
// var userList = null;
// var socketID = null;
var senderNickname = null;

// SOCKET

socket.on('sendingUser', function(users) {
  console.log(users);
  // userList = users;
  renderUserList(users);
});

// except sender
socket.on('chat', function(msg, nickname) {
  renderMessageWhenSend('ltr', msg, nickname);
});

// except sender
socket.on('typing', function(show, socketID, nickname) {

  // if (show) {
  //   if (!$('.typing-noty[data-id='+socketID+']')[0]) {
  //     var typingNoty = "<span data-id='"+socketID+"' data-remove-when-disconnect='"+socketID+"' class='typing-noty'>"+nickname+" đang trả lời...</span>";
  //     $('.someone-typing-noty').append(typingNoty);
  //   }
  // } else {
  //   if ($('.typing-noty[data-id='+socketID+']')[0]) {
  //     $('.typing-noty[data-id='+socketID+']').remove();
  //   }
  // }
});

// except sender
socket.on('newUserAnnouncement', function(nickname) {
  // alert(nickname+ " đã tham gia chatroom. Hãy gửi lời chào tới họ");
  createNoty('<b>'+nickname+'</b> đã tham gia chatroom. Hãy gửi lời chào tới người mới.');
});

$(document).ready(function () {
  $('textarea#chatbox').val('');

  socket.on('welcome', function(msg) {
    console.log(msg);
  });

  $('body').on('click', '.send-button:not(.disabled)', function() {
    var msg = $('textarea#chatbox').val();
    var nickname = senderNickname;
    if (msg != "" ) {
      msg = addLineBreak(msg);
      renderMessageWhenSend('rtl', msg, nickname);
      emitMessageToEveryone(msg, nickname);
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

function renderMessageWhenSend(dir, msg, name="Vô danh") {
  changeSendingButtonStatus();
  // var name = $('input[name=chat_nickname]').val();
  $.ajax({
    type: "GET",
    url: "/show-sender-message",
    data: {dir: dir, msg: msg, name: name},
    success: function (response) {
      // console.log(response);
      var container = $('.conversation')[0];
      $(container).append(response);
      scrollToBottom(container)
      clearMessageBox();
      changeSendingButtonStatus();
    }
  });
}

function emitMessageToEveryone(msg, nickname) {
  socket.emit('chat', msg, nickname);
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


// Register nickname
$(document).ready(function () {
  
  $('.accept-btn').click(function (e) { 
    var nickname = $('#nickname-modal input[name=nickname]').val();
    if (validateNickname(nickname)) {
      senderNickname = nickname;
      // alert(senderNickname);
      register(nickname);
    }
  });

});

function validateNickname(nickname) {
  if (nickname != "") {
    return true;
  }
  return false;
}

function register(nickname) {
  socket.emit('register', nickname);
  hideModal(modalID = 'nickname-modal');
  showSenderNickname(nickname);
  // alert('Chào mừng bạn tới chatroom. Hãy gửi những lời yêu thương tới mọi người...')
  createNoty('Chào mừng bạn tới chatroom. Hãy gửi những lời yêu thương tới mọi người...');
}

function showSenderNickname(nickname) {
  $('.chat-nickname').html(nickname);
  $('input[name=chat_nickname]').val(nickname);  
}

function hideModal(modalID) {
  $('#'+modalID).hide();
}

function renderUserList(users) {
  $('.user-list').html('');
  $.each(users, function (index, value) {
    if (value != null) {
      var li = "<li>"+value+"</li>";
      $('.user-list').append(li);
    }
  });  
}

function scrollToBottom(container) {
  container.scrollTop = container.scrollHeight;
}

function createNoty(text="text", type="info") {
  var noty = new Noty({
    type: type,
    theme: 'bootstrap-v4',
    layout: 'topRight',
    text: text
  });
  noty.show();
}