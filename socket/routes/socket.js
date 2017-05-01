const validator = require('validator');
const Room = require('../models/room.js');
const User = require('../models/user.js');
const MongoClient = require('mongodb');
const ObjectID = require('mongodb').ObjectID;

const Messages = []; //暂时存放画图坐标消息
const chatMessage = []; //暂存用户聊天消息
const onlineNum = []; //在线列表
const readyNum = []; //准备列表

module.exports = function(io){	
	//socket连接成功之后触发，用于初始化
	io.sockets.on('connection', function(socket){
		var user = socket.request.session.user;  //获取session
		console.log(user)
		var roomId = null;  //当前进入的房间id，进入房间赋值离开房间清除
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
		    		io.sockets.in(roomId).emit('userMessage', {
			    		content: user.nick + '进入房间',
			    		source: 2,
			    		head: '',
			    		nick: user.nick
		    		});
		    		//发送上线的用户信息
		    		if(!onlineNum[roomId]){onlineNum[roomId] = []};
		    		onlineNum[roomId].push({
		    			id: user._id,
			    		head: '',
			    		nick: user.nick,
			    		ready: false
		    		})
		    		io.sockets.in(roomId).emit('onlineNum', onlineNum[roomId]);
		    		//满足游戏房间人数
		    		if(!readyNum[roomId]){
		    			readyNum[roomId] = [];
		    			readyNum[roomId]['start'] = room.gamepeople;
		    		}
		    		//将用户加入房间用户列表，房间在线人数加1，满足房间人数-1
		    		Room.updateRoom({
						_id: ObjectID(roomId)
					}, {
						$inc:{
							online: 1,
							below: -1,
						},
						$addToSet:{
							gameuser: ObjectID(user._id)
						}
					}, function(err, result){
						
					})
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
	    
	    //离开房间、此方法不将用户移出房间，只是判断用户离开房间页面
	    socket.on('leaveRoom', function(){
	    	//离开房间删除
	    	for(let key in onlineNum[roomId]){
	    		if(user._id == onlineNum[roomId][key].id){
	    			onlineNum[roomId].splice(key, 1);
	    		}
	    	}
    		io.sockets.in(roomId).emit('onlineNum', onlineNum[roomId]);
	    	//用户离开房间页面，房间在线人数加-1，满足房间人数+1
    		Room.updateRoom({
				_id: ObjectID(roomId)
			}, {
				$inc:{
					online: -1,
					below: 1,
				}
			}, function(err, result){
				
			})
	    	roomId = null;
	    })
	    
	    //用户进入房间准备/取消准备
	    socket.on('readygame', function(message){
	    	if(message.ready){
	    		//需要满足准备人数
	    		var gameNum = readyNum[roomId]['start'];
	    		if(!onlineNum[roomId]){onlineNum[roomId] = []};
	    		if(!readyNum[roomId]['gameNum']){readyNum[roomId]['gameNum'] = []};
	    		console.log(gameNum)
	    		console.log(readyNum[roomId]['gameNum'].length)
	    		if(readyNum[roomId] && readyNum[roomId]['gameNum'].length < gameNum){
	    			//准备
		    		for(let key in onlineNum[roomId]){
		    			if(onlineNum[roomId][key].id == user._id){
		    				onlineNum[roomId][key].ready = true;
		    				readyNum[roomId]['gameNum'].push(user._id);
		    			}
		    		}
	    			//开始游戏
		    		if(readyNum[roomId]['gameNum'].length == gameNum){
		    			io.sockets.in(roomId).emit('startGame');
		    		}
	    		}else{
	    			return false;
	    		}
	    		io.sockets.in(roomId).emit('onlineNum', onlineNum[roomId]);
	    	}else{
	    		//取消
	    		if(!onlineNum[roomId]){onlineNum[roomId] = []};
	    		for(let key in onlineNum[roomId]){
	    			if(onlineNum[roomId][key].id == user._id){
	    				onlineNum[roomId][key].ready = false;
	    			}
	    		}
	    		//取消准备
	    		for(let key in readyNum[roomId]['gameNum']){
	    			if(readyNum[roomId]['gameNum'][key] == user._id){
	    				readyNum[roomId]['gameNum'].splice(key, 1);
	    			}
	    		}
	    		io.sockets.in(roomId).emit('onlineNum', onlineNum[roomId]);
	    	}
	    })
	    
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
	    socket.on('chatMessage', function(message, fn){
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
	        console.log(roomId);
	    	//离开房间删除
	    	for(let key in onlineNum[roomId]){
	    		if(user._id == onlineNum[roomId][key].id){
	    			onlineNum[roomId].splice(key, 1);
	    		}
	    	}
    		//取消准备
	    	if(readyNum[roomId]){
	    		for(let key in readyNum[roomId]['gameNum']){
	    			if(readyNum[roomId]['gameNum'][key] == user._id){
	    				readyNum[roomId]['gameNum'].splice(key, 1);
	    			}
	    		}
	    	}
    		io.sockets.in(roomId).emit('onlineNum', onlineNum[roomId]);
	        //当用户断开连接，是在房间页面断线，房间在线人数加-1，满足房间人数+1
	        if(roomId){
	    		Room.updateRoom({
					_id: ObjectID(roomId)
				}, {
					$inc:{
						online: -1,
						below: 1,
					}
				}, function(err, result){
					
				})
		    	roomId = null;
	        }
	    });
	    
	});
}