var crypto = require('crypto');//加密密码
var svgCaptcha = require('svg-captcha');
	
/* GET home page. */
module.exports = function(app){
	app.use(function(req, res, next){
	    next();
	})
	
	app.get('/', function(req, res){
	  	res.render('index');
	})
	
	app.get('/index', function(req, res){
	  	var json_data = {"name":"amita","pass":"1245"};
	  	res.json(json_data);
	})
	
	app.get('/code', function(req, res){
		var options = {
			width: 120,
			height: 40,
			noise: 3
		}
		var captcha = svgCaptcha.create(options);
		req.session.captcha = captcha.text;
		res.set('Content-Type', 'image/svg+xml');
		res.status(200).send(captcha.data);
	})
}

