/**
 * Created by dinesh on 21/12/17.
 */

// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
require('./modules/chat')(app);
var chatController = require('./modules/chat/chat.io');
var Chat = mongoose.model('Chat', { 
	text: String,
	msgTo: Number,
	msgFrom: Number,
	type: Number
});

global.mongoose = mongoose;
global.Chat = Chat;

chatController.init(io);

server.listen(port, function () {
	console.log('Server listening at port %d', port);
});
mongoose.connect('mongodb://localhost/chat', { useMongoClient: true });
mongoose.Promise = global.Promise;

// Routing
app.use(express.static(path.join(__dirname, '../public')));