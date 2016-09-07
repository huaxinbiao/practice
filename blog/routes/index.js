var crypto = require('crypto'),//加密密码
	User = require('../models/user.js'),
	Post = require('../models/post.js'),
	Comment = require('../models/comment.js'),
	Page = require('../models/page.js');
	
/* GET home page. */
module.exports = function(app){
	//首页
	//输出博客文章列表
	app.get('/', function(req, res) {
        var post = new Page(null, 1, 6, 'posts');
        post.find(function(err, posts, total){
            if(err){
				req.flash('error', err);
				return res.redirect('404');
            }
            var name = null;
            if(req.session.user){
                name = req.session.user.name;
            }
            Post.getAll(name, function(err, archive){
                if(err){
                    req.flash('error', err);
                    return res.redirect('404');
                }
                res.render('index', {
                    title: 'Great Taste',
                    user: req.session.user,
                    posts: posts,
                    archive: archive,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()
                });
            })
        });
	});

    app.get('/index', function(req, res) {
        req.redirect('/')
    });
	
	//注册页
	app.get('/reg',checkNotLogin);
	app.get('/reg', function(req, res){
	  res.render('reg', { 
	  	title: '注册',
	  	user: req.session.user,
	  	success: req.flash('success').toString(),
	  	error: req.flash('error').toString()
	  });
	});
	
	//注册
	app.post('/reg',checkNotLogin);
	app.post('/reg', function(req,res){
		var name = req.body.name,
			password = req.body.password,
			password_re = req.body['password-repeat'];
		//检验是否为空
		if(!password_re || !password || !name){
			req.flash('error', '信息不完整！');
			return res.redirect('/reg');//返回注册页
		}
		//检验两次密码是否一致
		if(password_re != password){
			req.flash('error', '两次输入的密码不一致！');
			return res.redirect('/reg');//返回注册页
		}
		//生成密码MD5
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		var newUser = new User({
			name: req.body.name,
			password: password,
			email: req.body.email
		});
		//检查用户名是否已经存在
		User.get(newUser.name, function(err, user){
			if(err){
				req.flash('error', err);
				return res.redirect('/');
			}
			if(user){
				req.flash('error', '用户已经存在！');
				return res.redirect('/reg');
			}
			//如果不存在就新增用户
			newUser.save(function(err, user){
				if(err){
					req.flash('error', err);
					return res.redirect('/reg');
				}
				req.session.user = user;//用户信息存入session
				req.flash('success', '注册成功！');
				res.redirect('/');
			});
		});
	})
	
	//登录页
	app.get('/login',checkNotLogin);
	app.get('/login', function(req, res){
	  res.render('login', { 
	  	title: '登录',
	  	user: req.session.user,
	  	success: req.flash('success').toString(),
	  	error: req.flash('error').toString()
	  });
	});
	
	//登录
	app.post('/login',checkNotLogin);
	app.post('/login', function(req, res){
		var name = req.body.name,
			password = req.body.password;
		//检验是否为空
		if(!password || !name){
			req.flash('error', '信息不完整！');
			return res.redirect('/login');
		}
		//生成密码MD5
		var md5 = crypto.createHash('md5'),
			password = md5.update(password).digest('hex');
		User.get(name, function(err, user){
			if(!user){
				req.flash('error','用户不存在或密码错误！');
				return res.redirect('/login');
			}
			if(user.password != password){
				req.flash('error','用户不存在或密码错误！');
				return res.redirect('/login');
			}
			//验证成功，将信息存入session
			req.session.user = user;
			req.flash('success','登录成功！');
			res.redirect('/');
		});
	});
	
	//发表文章页面显示
	app.get('/post',checkLogin);
	app.get('/post', function(req, res){
	  res.render('post', { 
	  	title: '发表文章',
	  	user: req.session.user,
	  	post: '',
	  	success: req.flash('success').toString(),
	  	error: req.flash('error').toString()
	  });
	});
	
	//发表文章
	app.post('/post',checkLogin);
	app.post('/post', function(req, res){
		var currentUser = req.session.user,
			post = new Post(currentUser.name, req.body.title, req.body.brief, req.body.tags, req.body.post);
		post.save(function(err){
			if(err){
				req.flash('error', err);
				return res.redirect('/');
			}
			req.flash('success','发布成功！');
			res.redirect('/');
		});
	});

	
	//我的 blog文章列表,没登录显示全部文章列表
	app.get('/blog', function(req, res){
		if(req.session.user){
			var name = req.session.user.name;
			//检查用户是否存在
			User.get(name, function(err,user){
				if(!user){
					req.flash('error', '用户不存在！');
					return res.redirect('/');
				}
				//查询并返回该用户的所有文章
                Page.pei(req, res, user.name, 10, 'posts', function(err, page){
                    res.render('blog', {
                        title: user.name+'的文章',
                        user: req.session.user,
                        user_name: user.name,
                        posts: page.posts,
                        total: page.total,
                        page: page.page,
                        success: req.flash('success').toString(),
                        error: req.flash('error').toString()
                    });
                });
			});
		}else{
            //查询所有文章
            Page.pei(req, res, user.name, 10, 'posts', function(err, page){
                res.render('blog', {
                    title: '文章列表',
                    user: req.session.user,
                    user_name: '',
                    posts: page.posts,
                    total: page.total,
                    page: page.page,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()
                });
            });
		}
	});

    //所有文章列表
	app.get('/blog/index', function(req, res){
        Page.pei(req, res, null, 10, 'posts', function(err, page){
            res.render('blog', {
                title: 'Great Taste',
                user: req.session.user,
                user_name: '',
                posts: page.posts,
                total: page.total,
                page: page.page,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    })

	//筛选一个用户的文章列表
	app.get('/blog/:name', function(req, res){
		//检查用户是否存在
		User.get(req.params.name, function(err,user){
			if(!user){
				req.flash('error', '用户不存在！');
				return res.redirect('/blog');
			}
			//查询并返回该用户的所有文章
            Page.pei(req, res, user.name, 10, 'posts', function(err, page){
                res.render('blog', {
                    title: user.name+'的文章',
                    user: req.session.user,
                    user_name: user.name,
                    posts: page.posts,
                    total: page.total,
                    page: page.page,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()
                });
            });
		});		
	});
	
	//文章详情页
	app.get('/blog/:name/:day/:title', function(req, res){
		Post.getOne(req.params.name, req.params.day, req.params.title, function(err, post){
			if(err){
				req.flash('error', err);
				return res.redirect('/');
			}
			res.render('article', {
				title: req.params.title,
				post: post,
				user: req.session.user,
			  	success: req.flash('success').toString(),
			  	error: req.flash('error').toString()
			});
		});
	})

    //文章评论
    app.post('/blog/:name/:day/:title', function(req, res){
        var date = new Date();
        //储存各种时间格式
        var time = {
            date: date,
            year: date.getFullYear(),
            month: date.getFullYear() + "-" +(date.getMonth() + 1),
            day: date.getFullYear() + "-" +(date.getMonth() + 1) + "-" + date.getDate(),
            minute: date.getFullYear() + "-" +(date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" +(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())
        }
        if(req.session.user){
            var name = req.session.user.name;
            var whatUser = 0;
        }else{
            var name = req.body.name;
            var whatUser = 1;
        }
        var comment = {
            name: name,
            head: '',
            time: time,
            comment: req.body.comment,
            whatUser: whatUser
        }
		var newComment = new Comment(req.params.name, req.params.title, req.params.day, comment);
		newComment.save(function(err){
			if(err){
				req.flash('error', err);
				return res.redirect('blog');
			}
			req.flash('success','评论成功！');
			res.redirect('back');
		});

    });
	
	//编辑文章页
	app.get('/edit/:name/:day/:title',checkLogin);
	app.get('/edit/:name/:day/:title', function(req, res){
		var currentUser = req.session.user;
		if(currentUser.name != req.params.name){
			return res.redirect('/blog');
		}
		Post.getOne(currentUser.name, req.params.day, req.params.title, function(err, post){
			if(err){
				req.flash('error', err);
				return res.redirect('/');
			}
			res.render('post', {
				title: req.params.title,
				post: post,
				user: req.session.user,
			  	success: req.flash('success').toString(),
			  	error: req.flash('error').toString()
			});
		});
	});
	
	//编辑文章
	app.post('/edit/:name/:day/:title',checkLogin);
	app.post('/edit/:name/:day/:title', function(req, res){
		var currentUser = req.session.user;
		if(currentUser.name != req.params.name){
			return res.redirect('/blog');
		}
		Post.update(currentUser.name, req.params.day, req.params.title, req.body.brief, req.body.tags, req.body.post, function(err){
			var url = encodeURI('/blog');
			if(err){
				req.flash('error', err);
				return res.redirect(url);//出错返回我的文章列表
			}
			req.flash('success', '修改成功！');
			res.redirect(url);
		});
	});
	
	//删除文章
	app.get('/remove/:name/:day/:title', checkLogin);
	app.get('/remove/:name/:day/:title', function(req, res){
		var currentUser = req.session.user;
		if(currentUser.name != req.params.name){
			return res.redirect('/blog');
		}
		Post.remove(currentUser.name, req.params.day, req.params.title, function(err){
			if(err){
				req.flash('error', err);
				return res.redirect('back');
			}
			req.flash('success', '删除成功！');
			res.redirect('/blog');
		});
	});
	
	//登出
	app.get('/logout',checkLogin);
	app.get('/logout', function(req, res){
		req.session.user = null;
		req.flash('success','退出成功！');
		res.redirect('/');
	});
	
	//页面权限控制
	function checkLogin(req, res, next){
		if(!req.session.user){
			req.flash('error', '请先登录！');
			res.redirect('/login');
		}
		next();
	}
	function checkNotLogin(req, res, next){
		if(req.session.user){
			req.flash('error', '已经登录！');
			res.redirect('back');
		}
		next();
	}
}

