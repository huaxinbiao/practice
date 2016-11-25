var express = require('express');
var app = express();
var path = require('path');

var port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '/static')));//设置静态文件存放目录
app.use(function(req, res){
    res.sendFile(path.join(__dirname, './static/index.html'))
})

var server = app.listen(port, function(){
    console.log('输出了'+ port +'!')
})
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(){
    socket.emit('connected')
})
