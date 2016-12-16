var express = require('express');
var app = express();
var path = require('path');

var port = process.env.PORT || 3000
console.log(port);
app.use(express.static(path.join(__dirname, '/static')));//设置静态文件存放目录
app.use(function(req, res){
    res.sendFile(path.join(__dirname, './static/index.html'))
})
var server = app.listen(port, function(){
    console.log('输出了'+ port +'!')
})
var io = require('socket.io').listen(server);

var messages = [];//暂时存放消息
//socket连接成功之后触发，用于初始化
io.sockets.on('connection', function(socket){
    socket.on('getAllMessages', function(){
        //用户连上后，发送messages
        socket.emit('allMessages', messages);
    });
    socket.on('createMessage', function(message){
        //用户向服务器发送消息，存放到messages
        //messages.push(message);
        //向除自己外的所有用户发送消息
        socket.broadcast.emit('messageAdded', message);
    });
})
