var crypto = require('crypto');//加密密码
var validator = require('validator');//表单验证
var svgCaptcha = require('svg-captcha');
var User = require('../models/user.js');
	
/* GET home page. */
module.exports = function(app){
	app.use(function(req, res, next){
		//设置跨域访问
   	 	res.header('Access-Control-Allow-Origin', '*');
	  	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
	  	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	
	  	if (req.method == 'OPTIONS') {
	    	res.send(200); /*让options请求快速返回*/
	  	}else {
	    	next();
	  	}
	})
	app.get('/', function(req, res){
	  	res.render('index');
	})
	
	app.get('/index', function(req, res){
	  	res.redirect('/');
	})
	
	app.get('/code', function(req, res){
		var options = {
			width: 120,
			height: 40,
			noise: 3
		};
		var captcha = svgCaptcha.create(options);
		req.session.captcha = captcha.text;
		res.set('Content-Type', 'image/svg+xml');
		res.status(200).send(captcha.data);
	})
	
	app.post('/reg', function(req, res){
		//生成密码MD5
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		var newUser = new User({
			mobile: req.body.mobile,
			password: password,
		});
		newUser.save(function(err, user){
			if(err){
				req.flash('error', err);
				return res.json({
					msg: '发生错误'
				});
			}
			req.session.user = user;//用户信息存入session
			res.status(200);
			res.json(user);
		});
	})
}

