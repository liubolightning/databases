var app = {};
app.server = "http://127.0.0.1:3000/classes/messages";
app.displayLength = 10;
app.friends = [];

// run initial fetch
app.init = function() {
  app.fetch();
}

// fetches data from server
app.fetch = function(){
  $.ajax({
    url: app.server,
    type: 'GET',
    data: 'order=-createdAt',
    contentType: 'application/json',
    success: function(data){
      app.clearMessages();
      for (var i = 0; i < app.displayLength; i++) {
        app.addMessage(data.results[i]);
      }
    },
    error: function(){
      console.log("Chatterbox: error occurred during fetch.");
    }
  });
}

// adds messages to HTML
app.addMessage = function(message) {
  var insert;
  if (app.friends.indexOf(message.username) >= 0) {
    insert = "<b>"+ _.escape(message.text) +'</b>';
  } else {
    insert = _.escape(message.text);
  }

  $("#chats").append('<li>'
                      + '<a href="#" class="username">'
                      + _.escape(message.username)
                      + '</a>'
                      +": "
                      + '<span>'
                      + insert
                      + '</span>'
                      +'</li>');
}

// removes messages from #chats
app.clearMessages = function() {
  $("#chats").empty();
}

// sends inputted message to server
app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function() {
      console.log('Chatterbox: message sent!');
    },
    error: function() {
      console.log('Chatterbox: failed to send message.');
    }
  })
}

// adds room to roomSelect
app.addRoom = function(room) {
  $("#roomSelect").append('<li>'+ _.escape(room) +'</li>');
}

// adds friend to friends list; invoked upon username click
app.addFriend = function(username) {
  if (app.friends.indexOf(username) === -1) {
    app.friends.push(username);
  }
}

// if there's a submission, put it into the right format and pass it to app.send
app.handleSubmit = function() {
  var message = {};
  message.username = $(location).attr("href").split("=")[1]; // may need to change this
  message.text = $('input').val();
  message.roomname = '';

  app.send(message);
  $('#message').val('');
}

// initializes the app
$(document).ready(function(){
  app.init();
  setInterval(function(){
    app.fetch();
  }, 1000);

  // button functionality
  $('#send').submit(function(event) {
    event.preventDefault();
    app.handleSubmit();
  });

  // friend functionality
  $('#chats').on('click', 'a', function() {
    app.addFriend($(this).text());
  });
});
