var mysql = require('mysql');
/* If the node mysql module is not found on your system, you may
 * need to do an "sudo npm install -g mysql". */

/* You'll need to fill the following out with your mysql username and password.
 * database: "chat" specifies that we're using the database called
 * "chat", which we created by running schema.sql.*/
var dbConnection = mysql.createConnection({
  user: "root",
  password: "",
  database: "chat"
});

dbConnection.connect();
/* Now you can make queries to the Mysql database using the
 * dbConnection.query() method.
 * See https://github.com/felixge/node-mysql for more details about
 * using this module.*/




exports.findAllMessages = function(cb){
  var messageQuery = 'SELECT textValue FROM messages';

  dbConnection.query(messageQuery, function(err, result){
    if(err){
      throw err;
    }else{
      cb(err, result);
    }
  });
};

exports.findUser = function(username, cb){
  var userQuery = 'SELECT * FROM users where name = ' + dbConnection.escape(username);

  dbConnection.query(userQuery, function(err, result){
    if(err){
      throw err;
    }else{
      cb(err, result);
    }
  });
};

exports.saveUser = function(username, cb){
  var insertUserQuery = 'INSERT INTO users (name) values (' + dbConnection.escape(username) + ')';

  dbConnection.query(insertUserQuery, function(err, result){
    if(err){
      throw err;
    }else{
      cb(result);
    }
  });
};

exports.saveMessage = function(message, userid, roomname, cb){
  var findRoomIDQuery = 'SELECT roomID FROM rooms WHERE roomName = ' + dbConnection.escape(roomname);

  dbConnection.query(findRoomIDQuery, function(err, roomIdArray){
    if(err){
      throw err;
    }else{
      var insertMessageQuery = 'INSERT INTO messages (textValue, roomID, userID) values (' + dbConnection.escape(message) + ', ' + dbConnection.escape(roomIdArray[0].roomID) + ', ' + dbConnection.escape(userid) + ')';

      dbConnection.query(insertMessageQuery, function(err){
        if(err){
          throw err;
        }else{
          cb();
        }
      });
    }
  });
};

exports.findRoom = function(roomname, cb){
  var findRoomQuery = 'SELECT roomID from rooms where roomName = ' + dbConnection.escape(roomname);

  dbConnection.query(findRoomQuery, function(err, result){
    if(err){
      throw err;
    }else{
      cb(err, result);
    }
  });
};

exports.saveRoom = function(roomname, cb){
  var sameRoomQuery = 'INSERT INTO rooms (roomName) values (' + dbConnection.escape(roomname) + ')';
  var args = Array.prototype.slice.call(arguments, 2);

  dbConnection.query(sameRoomQuery, function(err, result){
    if(err){
      throw err;
    }else{
      cb.apply(null, args);
    }
  });
};
