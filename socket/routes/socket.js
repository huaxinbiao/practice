const validator = require('validator');
const Room = require('../models/room.js');

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
		
		//用户进入房间，判断房间存不存在。
	    socket.on('enterRoom', function(message, fn){
	    	if(typeof message.room_id == "string"){
	    		if(!validator.isAlphanumeric(message.room_id)){
	    			return fn({
		    			code: 103,
		    			msg: "房间不存在"
		    		});
	    		}
		    	Room.getRoomOne(message.room_id, function(err, room){
		    		if(err){
		    			return fn({
			    			code: 200,
			    			msg: '获取房间错误'
			    		});
		    		}
		    		//房间存在将用户加入房间
		    		socket.join(message.room_id);
		    		fn({
		    			code: 200,
		    			data: room,
		    			msg: '进入房间成功'
		    		});
		    		io.sockets.in(message.room_id).emit('userMessage', {
			    		content: socket.request.session.user.mobile + '进入房间',
			    		source: 2
		    		});
		    	})
	    	}else{
	    		fn({
	    			code: 103,
	    			msg: "房间不存在"
	    		});
	    	}
	    });
	    
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