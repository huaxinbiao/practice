const crypto = require('crypto');//加密密码
const validator = require('validator');//表单验证
const svgCaptcha = require('svg-captcha');//验证码
const User = require('../models/user.js');
	
/* 登录，注册，首页 */
module.exports = function(app){
	app.use(function(req, res, next){
		//设置跨域访问
		/*let allowedOrigins = [
		    "http://localhost:8080"
	  	];
	　	// 这里是允许跨域的的domain列表
	  	let origin = req.headers.origin;
	  	if(allowedOrigins.indexOf(origin) > -1){
		    res.header('Access-Control-Allow-Origin', origin);
	   	 	//res.header('Access-Control-Allow-Origin', '*');
	   	 	res.header('Access-Control-Allow-Credentials', true);// Allow Cookie
		  	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
		  	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	  	}
	
	  	if (req.method == 'OPTIONS') {
	    	res.sendStatus(200); //让options请求快速返回
	  	}else {
	  		next();
	  	}*/
		next();
	})
	app.all('*', checkToken);
	
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
		req.session.captcha = captcha.text.toLowerCase();
		res.set('Content-Type', 'image/svg+xml');
		res.status(200).send(captcha.data);
	})
	
	//用户注册
	app.post('/reg', function(req, res){
		//判断验证码是否正确
		if(!req.body.code){
			return res.json({
				code: 100,
				msg: '验证码错误'
			});
		}
		let code = req.body.code.toLowerCase();//转小写
		if(req.session.captcha != code){
			return res.json({
				code: 100,
				msg: '验证码错误'
			});
		}
		req.session.captcha = null;
		if(!validator.isMobilePhone(req.body.mobile, 'zh-CN')){
			return res.json({
				code: 103,
				msg: '手机号错误'
			});
		}
		if(!validator.isLength(req.body.password, {min:6,max:12})){
			return res.json({
				code: 103,
				msg: '密码长度不正确'
			});
		}
		//生成密码MD5
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		var newUser = new User({
			mobile: req.body.mobile,
			password: password
		});
		//检查用户名是否已经存在
		User.get({
				mobile: newUser.mobile
		}, function(err, user){
			if(err){
				return res.json({
					code: 101,
					msg: '检查用户失败'
				});
			}
			if(user){
				return res.json({
					code: 102,
					msg: '用户已存在'
				});
			}
			//如果不存在就新增用户
			newUser.save(function(err, user){
				if(err){
					return res.json({
						code: 101,
						msg: '注册失败'
					});
				}
				req.session.user = user;//用户信息存入session
				res.status(200);
				res.json({
					code: 200,
					data:{
						mobile: user.mobile,
						token: user.token
					},
					msg: '注册成功'
				});
			});
		});
	})
	
	//登录
	app.post('/login', function(req, res){
		if(!validator.isMobilePhone(req.body.mobile, 'zh-CN')){
			return res.json({
				code: 103,
				msg: '账号或密码错误'
			});
		}
		if(!validator.isLength(req.body.password, {min:6,max:12})){
			return res.json({
				code: 103,
				msg: '账号或密码错误'
			});
		}
		//生成密码MD5
		let md5 = crypto.createHash('md5');
		let password = md5.update(req.body.password).digest('hex');
		 
		//获取用户信息
		User.get({
				mobile: req.body.mobile
			}, function(err, user){
			if(err){
				return res.json({
					code: 101,
					msg: '获取用户失败'
				});
			}
			if(user){
				if(user.password != password){
					return res.json({
						code: 102,
						msg: '账号或密码错误'
					});
				}
				let time = new Date().getTime().toString();
				let md5 = crypto.createHash('md5');
				let token = md5.update(time+req.body.password+'HUA').digest('hex');
				User.update({
						mobile: user.mobile
					}, {
						$set:{token: token}
					}, function(err, result){
					user.token = token;
					req.session.user = user;//用户信息存入session
					res.status(200);
					res.json({
						code: 200,
						data:{
							mobile: user.mobile,
							token: token
						},
						msg: '登录成功'
					});
				})
			}else{
				return res.json({
					code: 103,
					msg: '账号或密码错误'
				});
			}
		});
	})
	
	//退出登录
	app.get('/outlogin', function(req, res){
		req.session.user = null;
		return res.json({
			code: 200,
			msg: '退出成功'
		});
	})
	
	//页面权限控制
	function checkToken(req, res, next){
		let url = req.url.split("?")[0];
		console.log("2222222222222222222222222222222222222222222");
		console.log(req.session);
		if(url == '/login' || url == '/reg' || url == '/code' || url == '/' || url == '/index'){
			return next();
		}
		if(!req.session.user){
			return res.json({
				code: 104,
				msg: '请先登录'
			});
		}
		//判断请求方式,获取token
		if(req.method.toLowerCase() == 'get'){
			var token = req.query.token;
		}else{
			var token = req.body.token;
		}
		if(url == '/outlogin'){
			return next();
		}
		if(!token){
			return false;
		}
		//获取用户信息
		User.get({
				mobile: req.session.user.mobile
			}, function(err, user){
			if(err){
				return res.json({
					code: 101,
					msg: '获取用户失败'
				});
			}
			if(user){
				if(user.token != token){
		console.log("33333333333333333333333333333333333333333333");
					req.session.user = null;
					return res.json({
						code: 104,
						msg: 'Token错误'
					});
				}
				req.session.user = user;
				next();
			}else{
				req.session.user = null;
				return res.json({
					code: 104,
					msg: '账号错误'
				});
			}
		});
	}
}

