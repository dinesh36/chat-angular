/**
 * Created by dinesh on 21/12/17.
 */

// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var chatController = require('./modules/chat/chat.controller');
chatController.init(io);

server.listen(port, function () {
	console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, '../public')));