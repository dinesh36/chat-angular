// Chatroom
function init(io){
	var sockets = {};

	var numUsers = 0;

	io.on('connection', function (socket) {
		var addedUser = false;
		var userId = socket.request._query['userId'];
		sockets[userId] = socket;
		socket.userId = userId;
		socket.broadcast.emit('status', {
			userId: socket.userId,
			status: 'online'
		});
		// when the client emits 'new message', this listens and executes
		socket.on('new message', function (data) {
			// we tell the client to execute 'new message'
			var chat = new Chat(data);
			chat.save(function (err) {
				if (err) {
					console.log(err);
				} else {
					console.log('Message saved!');
				}
			});
			socket.broadcast.emit('new message', {
				username: socket.username,
				message: data
			});
		});

		socket.on('status',function(data){
			var userId = data.userId;
			if(sockets[userId]){
				socket.emit('status',{userId:userId,status:'online'});
			} else {
				socket.emit('status',{userId:userId,status:'offline'});
			}
		});

		socket.on('screen share', function (data) {
			// we tell the client to execute 'new message'
			socket.broadcast.emit('screen share', {
				username: socket.username,
				message: data
			});
		});

		socket.on('user feed', function (data) {
			// we tell the client to execute 'new message'
			socket.broadcast.emit('user feed', {
				username: socket.username,
				message: data
			});
		});

		// when the client emits 'add user', this listens and executes
		socket.on('add user', function (username) {
			sockets[username] = socket;
			if (addedUser) return;

			// we store the username in the socket session for this client
			socket.username = username;
			++numUsers;
			addedUser = true;
			socket.emit('login', {
				numUsers: numUsers
			});
			// echo globally (all clients) that a person has connected
			socket.broadcast.emit('user joined', {
				username: socket.username,
				numUsers: numUsers
			});
		});

		// when the client emits 'typing', we broadcast it to others
		socket.on('typing', function () {
			socket.broadcast.emit('typing', {
				username: socket.username
			});
		});

		// when the client emits 'stop typing', we broadcast it to others
		socket.on('stop typing', function () {
			socket.broadcast.emit('stop typing', {
				username: socket.username
			});
		});

		// when the user disconnects.. perform this
		socket.on('disconnect', function () {
			socket.broadcast.emit('status', {
				userId: socket.userId,
				status: 'offline'
			});
			delete sockets[socket.userId];
			if (addedUser) {
				--numUsers;
				// echo globally that this client has left
					socket.broadcast.emit('user left', {
					username: socket.username,
					numUsers: numUsers
				});
			}
		});
	});
}

exports.init = init;