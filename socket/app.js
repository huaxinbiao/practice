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

var messages = [];
io.sockets.on('connection', function(socket){
    socket.on('getAllMessages', function(){
        socket.emit('allMessages', messages);
    });
    socket.on('createMessage', function(){
        messages.push(messages);
        io.sockets.emit('messageAdded', messages);
    })
})
