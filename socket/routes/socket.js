const validator = require('validator');
const Room = require('../models/room.js');
const User = require('../models/user.js');
const MongoClient = require('mongodb');
const ObjectID = require('mongodb').ObjectID;

const Messages = []; //暂时存放画图坐标消息
const chatMessage = []; //暂存用户聊天消息

module.exports = function(io){	
	//socket连接成功之后触发，用于初始化
	io.sockets.on('connection', function(socket){
		console.log('连接成功')
		var user = socket.request.session.user;
		var roomId = null;
		if(!user){
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
		    		//为房间建立数组存放消息
		    		roomId = message.room_id;
		    		if(!Messages[roomId]){
		    			Messages[roomId] = [];
		    		}
		    		fn({
		    			code: 200,
		    			data: room,
		    			msg: '进入房间成功'
		    		});
		    		//发送进入房间通知
		    		io.sockets.in(message.room_id).emit('userMessage', {
			    		content: user.nick + '进入房间',
			    		source: 2
		    		});
		    		
		    		//'$addToSet'这个方法向数组中增加值。$addToSet’,'$each’的组合方式添加多个值到数组中
		    		//当用户进入过一个房间自动保存到用户的房间列表中
		    		User.update({
						mobile: user.mobile
					}, {
						$addToSet:{
							room: ObjectID(message.room_id)
						}
					}, function(err, result){
						
					})
		    	})
	    	}else{
	    		fn({
	    			code: 103,
	    			msg: "房间不存在"
	    		});
	    	}
	    });
	    
	    //用户发送的画图坐标
	    socket.on('createMessage', function(message){
	        //用户向服务器发送消息，存放到messages
		    console.log(roomId);
	        Messages[roomId].push(message);
	        //向房间内除自己外的所有用户发送消息
	        socket.broadcast.to(roomId).emit('messageAdded', message);
	    });
	    
	    //用户进入房间，获取已存在的房间消息，与画图坐标
	    socket.on('getAllMessages', function(){
	        socket.emit('allMessages', Messages[roomId]);
	    });
	    
	    //用户发送的聊天信息
	    socket.on('chatMessage', function(message,fn){
	    	if(message.source == 1){
	    		message.source = 2;
	    	}
	        socket.broadcast.to(roomId).emit('userMessage', message);
	    	fn();//回调，告诉客户端发送成功；
	    })
	    
	    //连接成功发送消息
	    socket.emit('reconnecp', {
	    	login: 1,
	    	msg: '连接成功'
	    });
	    
	    //断开连接监听
	    socket.on('disconnect', function(message){
	        //断开连接
	        console.log(message)
	    });
	    
	});
}