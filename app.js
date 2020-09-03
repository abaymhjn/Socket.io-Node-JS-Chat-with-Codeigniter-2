var express = require('express');
var app = express();
var socket = require('socket.io');
const jwt = require('jsonwebtoken');
const secret = "my_super_secret_key";

var server = require('http').createServer(app);
var io = socket.listen( server );
var port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});
//app.set('port', (process.env.PORT || 3000));


//var server = app.listen(3000);
//var io = socket.listen(server);
var async = require('async');
var mysql= require('mysql');
var pool  = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database:'chat',
});


var chatserver=require('./chatserver.js');
 
io.use(function (socket, next) {
  var token = socket.handshake.query.token,
  decodedToken;
  try {
    decodedToken = jwt.verify(token, secret);
    //console.log("token valid for user", decodedToken.id);
    socket.connectedUser = decodedToken.id;
    next();
  } 
  catch (err) 
  {
    //console.log(err);
    next(new Error("not valid token"));
    //socket.disconnect();
  }
});
io.on('connection', function (socket) {
    console.log('Connected! User: ', socket.connectedUser);
    //socket.connectedUser = decodedToken.id;
    var chatpage=io.of('/chatpage');
    chatserver.getUserFeeds(chatpage,socket,io,pool,async);
}); /**/