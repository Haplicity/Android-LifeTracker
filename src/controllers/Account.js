var models = require('../models');
var Account = models.Account;

var loginPage = function(req, res) {
	res.render('login', { csrfToken: req.csrfToken() });
};

var signupPage = function(req, res) {
	res.render('signup', { csrfToken: req.csrfToken() });
};

var logout = function(req, res) {
	req.session.destroy();
	res.redirect('/');
};

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

var socketLogin = function(socket, data) {
	console.log(data);
	Account.AccountModel.authenticate(data[0].username, data[0].pass, function(err, account) {
		var accountData = account.toAPI();
		
		if (err || !account) {
			socket.emit('loginResult', {success: false, id: accountData._id});
		} else {
			socket.emit('loginResult', {success: true, id: accountData._id});
		}
	});
};

var socketSignup = function(socket, data) {
	Account.AccountModel.generateHash(data[0].pass, function(salt, hash) {
		var accountData = {
			username: data[0].username,
			salt: salt,
			password: hash
		};
		
		var newAccount = new Account.AccountModel(accountData);
		
		newAccount.save(function(err) {
			var accountData = newAccount.toAPI();
			
			if(err) {
				socket.emit('signupResult', {success: false, id: accountData._id});
			} else {
				socket.emit('signupResult', {success: true, id: accountData._id});
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