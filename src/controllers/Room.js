var _ = require('underscore');
var models = require('../models');

var Room = models.Room;

var makerPage = function(req, res) {
	Room.RoomModel.findAll(function(err, docs) {
		if (err) {
			console.log(err);
			return res.status(400).json({error: 'An error occurred'});
		}
		
		res.render('app', { csrfToken: req.csrfToken(), rooms: docs});
	});
};

var makeRoom = function(req, res) {
	if (!req.body.name) {
		return res.status(400).json({error: "Name is required"});		
	}
	
	var RoomData = {
		name: req.body.name,
		description: req.body.description,
		creator: req.session.account._id,
		users: req.session.account.username
	};
	
	var newRoom = new Room.RoomModel(RoomData);
	
	newRoom.save(function(err) {
		if (err) {
			console.log(err);
			return res.status(400).json({error: 'An error occurred'});
		}
		
		res.json({redirect: '/maker'});
	});
};

var joinRoom = function(req, res) {
	Room.RoomModel.findByName(req.body.creator, req.body.name, function(err, docs) {
		if (err) {
			console.log(err);
			return res.status(400).json({error: 'An error occurred'});
		}
		
		var index = docs.users.indexOf(req.session.account.username);

		if (index < 0) {
			docs.users.push(req.session.account.username);
		} else {
			console.log("User has already joined that room");
		}
		
		docs.save(function(err) {
			if (err) {
				console.log(err);
				return res.status(400).json({error: 'An error occurred'});
			}
			
			res.json({redirect: '/maker'});
		});
	});
};

var leaveRoom = function(req, res) {
	Room.RoomModel.findByName(req.body.creator, req.body.name, function(err, docs) {
		if (err) {
			console.log(err);
			return res.status(400).json({error: 'An error occurred'});
		}
		
		var index = docs.users.indexOf(req.session.account.username);

		if (index > -1) {
			docs.users.splice(index, 1);
		} else {
			console.log("User has not joined that room");
		}
		
		if (docs.users.length === 0) {
			docs.remove(function(err) {
				if (err) {
					console.log(err);
					return res.status(400).json({error: 'An error occurred'});
				}
				
				res.json({redirect: '/maker'});
			});
		} else {
			docs.save(function(err) {
				if (err) {
					console.log(err);
					return res.status(400).json({error: 'An error occurred'});
				}
				
				res.json({redirect: '/maker'});
			});
		}
	});
};

var socketCreateRoom = function(socket, data) {

	var RoomData = {
		name: data[0].title,
		description: data[0].description,
		creator: data[0].creator,
		users: data[0].username
	};
	
	var newRoom = new Room.RoomModel(RoomData);
	
	newRoom.save(function(err) {
		if (err) {
			socket.emit('createRoomResult', {success: false});
		} else {
			socket.emit('createRoomResult', {success: true});
		}
	});
};

var socketGetRooms = function(socket) {
	Room.RoomModel.findAll(function(err, docs) {
		if (err) {
			socket.emit('getRoomResults', {success: false, rooms: docs});
		} else {
			socket.emit('getRoomResults', {success: true, rooms: docs});
		}
	});
};

module.exports.makerPage = makerPage;
module.exports.make = makeRoom;
module.exports.join = joinRoom;
module.exports.leave = leaveRoom;
module.exports.socketCreateRoom = socketCreateRoom;