var messages = []; //暂时存放画图坐标消息
var chatMessage = []; //暂存用户聊天消息


module.exports = function(io){	
	//socket连接成功之后触发，用于初始化
	io.sockets.on('connection', function(socket){
		console.log('连接成功')
		if(!socket.request.session.user){
			//先告诉客户端未登录，不用自动重连
			socket.emit('nologin', {
				login: 0
			});
			//未登录用户断开连接
			socket.disconnect();
			return false;
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
	    
	    //测试连接是否成功
	    socket.on('reconnec', function(message, fn){
	        //用户连上后，发送messages
	        socket.emit('reconnecp', {v:0});
	        console.log(message)
	        fn();
	    });
	    
		socket.on('disconnect',function(data){
			console.log('断开连接')
		});
	});
	
}