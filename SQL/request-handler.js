var db = require('./db');
var serverHelpers = require('./server-helpers');
// wham! magic.
var parseData = serverHelpers.collectData;
var saveMessage = db.saveMessage;
var saveUser = db.saveUser;
var findMessages = db.findAllMessages;
var findUser = db.findUser;
var findRoom = db.findRoom;
var saveRoom = db.saveRoom;


exports.postMessage = function(req, res) {
  // declare this variable so we can retain access to it throughout the entire promise chain.
  var message;

  var resultsCallback = function (results) {
      var chat = {
        message: message.message,
        userid: results[0].userID,
        roomname: message.roomname
      };

      findRoom(message.roomname, function(err, results){
        if(results === undefined || results.length === 0){
          saveRoom(message.roomname, saveMessage, chat.message, chat.userid, chat.roomname, function () {
            serverHelpers.sendResponse(res, message);
          });
        }else{
          saveMessage(chat.message, chat.userid, chat.roomname, function () {
            serverHelpers.sendResponse(res, message);
          });
        }
      });

      // saveMessage(chat.message, chat.userid, chat.roomname, function () {
      //   serverHelpers.sendResponse(res, message);
      // });
  };

  parseData(req, function(_, msg) {
      message = msg;
      findUser(msg.username, function (err, results) {
        // no results/0 results
        if (!results || !results.length) {
          // create the user, then post the message
          saveUser(message.username, resultsCallback);
        } else {
          // user exists, post the message to this user
          resultsCallback(results);
        }
      });
  });
};

exports.getMessages = function(req, res) {
  findMessages(function(err, messages) {
      serverHelpers.sendResponse(res, messages);
  });
};

exports.sendOptionsResponse = function(req, res) {
  serverHelpers.sendResponse(res, null);
};
