var mongoose = require('mongoose');
var _ = require('underscore');

var RoomModel;

var setName = function(name) {
	return _.escape(name).trim();
};

var RoomSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		set: setName
	},
	
	description: {
		type: String,
		rquired: true,
		trim: true
	},
	
	creator: {
		type: String,
		required: true,
		trim: true
	},
	
	users: {
		type: [String],
		required: true,
		trim: true,
		match: /^[A-Za-z0-9_\-\.]{1,16}$/
	},
	
	createdDate: {
		type: Date,
		default: Date.now
	}
});

RoomSchema.methods.toAPI = function() {
	return {
		name: this.name,
		creator: this.creator,
		users: this.users
	};
};

RoomSchema.statics.findAll = function(callback) {
	return RoomModel.find().select("name description creator users").exec(callback);
};

RoomSchema.statics.findByName = function(creatorId, roomName, callback) {
	var search = {
		creator: mongoose.Types.ObjectId(creatorId),
		name: roomName
	};
	
	return RoomModel.findOne(search).select("name description creator users").exec(callback);
};

RoomModel = mongoose.model('Room', RoomSchema);

module.exports.RoomModel = RoomModel;
module.exports.RoomSchema = RoomSchema;