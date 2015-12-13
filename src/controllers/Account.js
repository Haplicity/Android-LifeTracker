var models = require('../models');
var Account = models.Account;

//loads login page
var loginPage = function(req, res) {
	res.render('login', { csrfToken: req.csrfToken() });
};

//loads signup page
var signupPage = function(req, res) {
	res.render('signup', { csrfToken: req.csrfToken() });
};

//logs user out
var logout = function(req, res) {
	req.session.destroy();
	res.redirect('/');
};

//authenticates user login
var login = function(req, res) {
	if (!req.body.username || !req.body.pass) {
		return res.status(400).json({error: "All fields are required!"});
	}
	
	Account.AccountModel.authenticate(req.body.username, req.body.pass, function(err, account) {
		if (err || !account) {
			return res.status(401).json({error: "Wrong username or password!"});
		}
		
		req.session.account = account.toAPI();
		
		res.json({redirect: '/maker'});
	});
};

//adds new account to database, and then logs new account in
var signup = function(req, res) {
	if (!req.body.username || !req.body.pass || !req.body.pass2) {
		return res.status(400).json({error: "All fields are required!"});
	}
	
	if (req.body.pass !== req.body.pass2) {
		return res.status(400).json({error: "Passwords do not match!"});
	}
	
	Account.AccountModel.generateHash(req.body.pass, function(salt, hash) {
		var accountData = {
			username: req.body.username,
			salt: salt,
			password: hash
		};
		
		var newAccount = new Account.AccountModel(accountData);
		
		newAccount.save(function(err) {
			if(err) {
				console.log(err);
				return res.status(400).json({error: 'An error occurred'});
			}
			
			req.session.account = newAccount.toAPI();
			
			res.json({redirect: '/maker'});
		});
	});
};

//authenticates login data from Android device
var socketLogin = function(socket, data) {
	Account.AccountModel.authenticate(data[0].username, data[0].pass, function(err, account) {
		if (err || !account) {
			socket.emit('loginResult', {success: false});
			return;
		} 
		
		var accountData = account.toAPI();
		
		//send results back to device
		socket.emit('loginResult', {success: true, id: accountData._id});
	});
};

//creates new account from Android device
var socketSignup = function(socket, data) {
	Account.AccountModel.generateHash(data[0].pass, function(salt, hash) {
		var accountData = {
			username: data[0].username,
			life: 40,
			salt: salt,
			password: hash
		};
		
		var newAccount = new Account.AccountModel(accountData);
		
		newAccount.save(function(err) {
			if(err) {
				socket.emit('signupResult', {success: false});
				return;
			} 
			
			accountData = newAccount.toAPI();
			
			//send results back to device
			socket.emit('signupResult', {success: true, id: accountData._id});
		});
	});
};

//updates account life total from Android device
var socketUpdateLife = function(io, socket, data) {
	Account.AccountModel.findByUsername(data[0].username, function(err, account) {
		if (err) {
			socket.emit('updateLifeResult', {success: false});
			return;
		}
		
		if(!account) {
			socket.emit('updateLifeResult', {success: false});
            return;
        }
		
		account.life += data[0].gainNumber;
		account.save(function(err) {
			if (err) {
				socket.emit('updateLifeResult', {success: false});
				return;
			}
			
			//send results to all devices in the room
			io.to(data[0].roomName + data[0].creator).emit('updateLifeResult', {success: true, username: data[0].username, lifeGain: data[0].gainNumber});
		});
	});
};

//resets account life to default value
var resetLife = function(data) {
	Account.AccountModel.findByUsername(data[0].username, function(err, account) {
		if (err) {
			return;
		}
		
		if(!account) {
            return callback();
        }
		
		account.life = 40;
		account.save(function(err) {
			if (err) {
				return;
			}
		});
	});
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signupPage = signupPage;
module.exports.signup = signup;
module.exports.socketLogin = socketLogin;
module.exports.socketSignup = socketSignup;
module.exports.socketUpdateLife = socketUpdateLife;
module.exports.resetLife = resetLife;