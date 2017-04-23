var messages = []; //暂时存放画图坐标消息
var chatMessage = []; //暂存用户聊天消息


module.exports = function(io){	
	//socket连接成功之后触发，用于初始化
	io.sockets.on('connection', function(socket){
		console.log('连接成功')
		console.log(socket.id)
		if(!socket.request.session.user){
			socket.emit('nologin', {login: 0});
			socket.disconnect();
		};
		
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
	    
	    socket.emit('reconnecp', {v:0});
	    
	    socket.on('disconnect', function(message){
	        //断开连接
	        console.log(message)
	    });
	});
	
}