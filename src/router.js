var controllers = require('./controllers');
var mid = require('./middleware');
var router = function(app) {
	
	app.get("/login", mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
	app.post("/login", mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
	app.get("/signup", mid.requiresSecure, mid.requiresLogout, controllers.Account.signupPage);
	app.post("/signup", mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
	app.get("/logout", mid.requiresLogin, controllers.Account.logout);
	app.get("/maker", mid.requiresLogin, controllers.Room.makerPage);
	app.post("/maker", mid.requiresLogin, controllers.Room.make);
	app.get("/join", mid.requiresLogin, controllers.Room.makerPage);
	app.post("/join", mid.requiresLogin, controllers.Room.join);
	app.get("/leave", mid.requiresLogin, controllers.Room.makerPage);
	app.post("/leave", mid.requiresLogin, controllers.Room.leave);
	app.get("/", mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;