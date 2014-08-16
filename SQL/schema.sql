CREATE DATABASE chat;

USE chat;

CREATE TABLE users(
  userID INT NOT NULL AUTO_INCREMENT,
  name varchar(140),
  PRIMARY KEY (userID)
);

CREATE TABLE rooms(
  roomID INT NOT NULL AUTO_INCREMENT,
  roomName varchar(140),
  PRIMARY KEY (roomID)
);

CREATE TABLE messages (
  messageID INT AUTO_INCREMENT,
  textValue varchar(140),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  roomID INT NOT NULL,
  userID INT NOT NULL,
  primary key (messageID),
  foreign key (userID) references users(userID),
  foreign key (roomID) references rooms(roomID)
);


/*  Execute this file from the command line by typing:
 *    mysql < schema.sql
 *  to create the database and the tables.*/




