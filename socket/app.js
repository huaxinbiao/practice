var express = require('express');
var path = require('path');
var session = require('express-session');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var settings = require('./settings');
var routes = require('./routes/index');

var app = express();

app.set('port',process.env.POST || 3000);

app.set('views', path.join(__dirname, 'views'));//设置模板目录
app.set('view engine', 'ejs');//设置模板引擎
app.use(express.static(path.join(__dirname, '/static')));//设置静态文件存放目录

//session
app.use(session({
	secret: settings.cookieSecret,
	key: settings.db,//cookie name
	cookie: {maxAge:1000 * 60 * 60 * 24 * 30},//30天
	/*store: new MongoStore({
		db: settings.db,
		host: settings.host,
		port: settings.port,
		url: 'mongodb://localhost/blog'
	})*/
}));

routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
//开发环境下的错误处理，将错误渲染error模板显示到浏览器中
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
//生产环境下的错误处理，将错误渲染error模板显示到浏览器中
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


var server = app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


//聊天
var io = require('socket.io').listen(server);

var messages = [];//暂时存放画图坐标消息
var chatMessage = [] //暂存用户聊天消息

//socket连接成功之后触发，用于初始化
io.sockets.on('connection', function(socket){
    socket.on('getAllMessages', function(){
        //用户连上后，发送messages
        socket.emit('allMessages', messages);
    });
    socket.on('createMessage', function(message){
        //用户向服务器发送消息，存放到messages
        messages.push(message);
        //向除自己外的所有用户发送消息
        socket.broadcast.emit('messageAdded', message);
    });
    //用户发送的聊天信息
    socket.on('chatMessage', function(message,fn){
    	if(message.source == 1){
    		message.source = 2;
    	}
    	socket.broadcast.emit('userMessage', message);
    	fn();//回调，告诉客户端发送成功；
    })
})


