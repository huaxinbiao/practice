var express = require('express');
var Server = require("http").Server;
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var settings = require('./settings');
var routes = require('./routes/index');
var Socket = require('./routes/socket');
var room = require('./routes/room');

var app = express();
//socket共享session
var server = Server(app);
var sio = require("socket.io")(server);

app.set('port',process.env.POST || 3000);

app.set('views', path.join(__dirname, 'views'));//设置模板目录
app.set('view engine', 'ejs');//设置模板引擎
app.use(express.static(path.join(__dirname, '/static')));//设置静态文件存放目录

app.use(bodyParser.json());//加载解析json的中间件
app.use(bodyParser.urlencoded({ extended: false }));


//session
var sessionMiddleware = session({
    resave: true,  //是否允许session重新设置，要保证session有操作的时候更新session必须设置这个属性为true
    rolling: true, //是否按照原设定的maxAge值重设session同步到cookie中，要保证session有操作的时候必须设置这个属性为true*/
    saveUninitialized: true,  //是否设置session在存储容器中可以给修改
	secret: settings.cookieSecret,
	key: settings.db,//cookie name
	cookie: {maxAge:1000 * 60 * 60 * 24 * 30},//30天
	store: new MongoStore({
		db: settings.db,
		host: settings.host,
		port: settings.port,
		url: 'mongodb://localhost/chat'
	})
})
sio.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
})
app.use(sessionMiddleware);

routes(app);
room(app);

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


var d_server = app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//聊天Socket
Socket(sio.listen(d_server))




