const validator = require('validator');
const Room = require('../models/room.js');
const User = require('../models/user.js');
const MongoClient = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
const Vocable = require('./vocable.js');

const Messages = []; //暂时存放画图坐标消息
const chatMessage = []; //暂存房间聊天信息，游戏结束时将消息存入数据库
const onlineNum = []; //在线列表
const readyNum = []; //准备列表

module.exports = function(io){	
	//socket连接成功之后触发，用于初始化
	io.sockets.on('connection', function(socket){
		var user = socket.request.session.user;  //获取session
		var roomId = null;  //当前进入的房间id，进入房间赋值离开房间清除
		var roomInfo = {
			gamepeople: 0
		}; //房间信息
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
		    		//房间存在,将用户加入房间
		    		socket.join(room._id);
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
		    		//为房间建立数组存放消息
		    		roomInfo = room;
		    		roomId = room._id;
		    		if(!Messages[roomId]){
		    			Messages[roomId] = [];
		    		}
		    		//发送进入房间通知
		    		socket.broadcast.to(roomId).emit('userMessage', {
			    		content: user.nick + '进入房间',
			    		source: 2,
			    		head: '',
			    		nick: user.nick
		    		});
		    		//发送上线的用户信息
		    		if(!onlineNum[roomId]){
		    			onlineNum[roomId] = []
	    			};
		    		onlineNum[roomId].push({
		    			id: user._id,
			    		head: user.head,
			    		nick: user.nick,
			    		ready: false
		    		})
		    		io.sockets.in(roomId).emit('onlineNum', onlineNum[roomId]);
		    		//满足游戏de房间人数
		    		if(!readyNum[roomId]){
		    			readyNum[roomId] = [];
		    			readyNum[roomId]['start'] = room.gamepeople;
		    			readyNum[roomId]['next'] = 0;
		    		}
		    		//将用户加入房间用户列表，房间在线人数加1，满足房间人数-1
		    		Room.updateRoom({
						_id: ObjectID(roomId)
					}, {
						$set:{
							online: onlineNum[roomId].length,
							below: roomInfo.gamepeople - onlineNum[roomId].length
						},
						$addToSet:{
							gameuser: ObjectID(user._id)
						}
					}, function(err, result){
						
					})
		    		if(room.ingame == 1){
		    			return fn({
			    			code: 201,
			    			data: {
			    				room: room,
			    				id: socket.id,
			    				gameNum: readyNum[roomId]['gameNum']
			    			},
			    			msg: '游戏已经开始，请先观战！'
			    		});
		    		}
		    		fn({
		    			code: 200,
		    			data: {
		    				room: room,
		    				id: socket.id
		    			},
		    			msg: '进入房间成功'
		    		});
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
	    	//离开房间从在线列表删除
    		if(!onlineNum[roomId]){onlineNum[roomId] = []};
    		if(!readyNum[roomId]){readyNum[roomId] = []};
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
				$set:{
					online: onlineNum[roomId].length,
					below: roomInfo.gamepeople - onlineNum[roomId].length
				}
			}, function(err, result){
				
			})
    		//取消准备
    		if(readyNum[roomId] && !readyNum[roomId]['current']){
	    		for(let key in readyNum[roomId]['gameNum']){
	    			if(readyNum[roomId]['gameNum'][key].userId == user._id){
	    				readyNum[roomId]['gameNum'].splice(key, 1);
	    			}
	    		}
    		}
    		io.sockets.in(roomId).emit('onlineNum', onlineNum[roomId]);
	    	//roomId = null;
	    })
	    
	    //用户进入房间准备/取消准备
	    socket.on('readygame', function(message){ 
	    	if(message.ready){
	    		//需要满足准备人数
	    		if(!readyNum[roomId]){readyNum[roomId] = []};
	    		let gameStartP = readyNum[roomId]['start'];
	    		if(!onlineNum[roomId]){onlineNum[roomId] = []};
	    		if(!readyNum[roomId]['gameNum']){readyNum[roomId]['gameNum'] = []};
	    		if(readyNum[roomId] && readyNum[roomId]['gameNum'].length < gameStartP){
	    			//准备
		    		for(let key in onlineNum[roomId]){
		    			if(onlineNum[roomId][key].id == user._id){
		    				onlineNum[roomId][key].ready = true;
		    				readyNum[roomId]['gameNum'].push({
		    					userId: user._id,
		    					socketId: socket.id //用于单人发消息
	    					});
		    			}
		    		}
	    			//开始游戏、、写入数据库
		    		if(readyNum[roomId]['gameNum'].length == gameStartP){
		    			Room.updateRoom({
							_id: ObjectID(roomId)
						}, {
							$set:{ingame: 1}
						}, function(err, result){
							io.sockets.in(roomId).emit('startGame', {
								gameNum: readyNum[roomId]['gameNum']
							});
							//第一个人开始画
							startDraw(0);
						})
		    		}
	    		}else{
	    			return false;
	    		}
	    		io.sockets.in(roomId).emit('onlineNum', onlineNum[roomId]);
	    	}else{
	    		//取消准备
	    		if(!onlineNum[roomId]){onlineNum[roomId] = []};
	    		for(let key in onlineNum[roomId]){
	    			if(onlineNum[roomId][key].id == user._id){
	    				onlineNum[roomId][key].ready = false;
	    			}
	    		}
	    		//从准备数组中删除
	    		if(readyNum[roomId] && !readyNum[roomId]['current']){
		    		for(let key in readyNum[roomId]['gameNum']){
		    			if(readyNum[roomId]['gameNum'][key].userId == user._id){
		    				readyNum[roomId]['gameNum'].splice(key, 1);
		    			}
		    		}
	    		}
	    		io.sockets.in(roomId).emit('onlineNum', onlineNum[roomId]);
	    	}
	    })
	    
	    //用户发送的画图坐标
	    socket.on('createMessage', function(message){
	    	//判断是否当前用户发送的
	    	if(!readyNum[roomId] || readyNum[roomId]['current'] != socket.id){
	    		return false;
	    	}
	        //用户向服务器发送消息，存放到messages
	        Messages[roomId].push(message);
	        //向房间内除自己外的所有用户发送消息
	        socket.broadcast.to(roomId).emit('messageAdded', message);
	    });
	    
	    //用户选择词语
	    socket.on('setVocable', function(message){
	    	readyNum[roomId]['vocable'] = message;
	    	console.log(readyNum[roomId]['vocable'], 3333)
	    })
	    
	    //用户清除画布
	    socket.on('resetCanvas', function(){
	    	//判断是否当前用户发送的
	    	if(!readyNum[roomId] || readyNum[roomId]['current'] != socket.id){
	    		return false;
	    	}
	    	Messages[roomId] = [];
	        //向房间内除自己外的所有用户发送消息
	        socket.broadcast.to(roomId).emit('resetCanvas');
	    });
	    
	    //用户进入房间，获取已存在的房间消息，与画图坐标
	    socket.on('getAllMessages', function(){
	    	let vocable = null;
	    	
	    	if(readyNum[roomId] && readyNum[roomId]['vocable'] && readyNum[roomId]['current'] == socket.id){
	    		vocable = readyNum[roomId]['vocable']
	    	}
	    	
	    	//获取数据库中的房间聊天消息
	    	//******翻页功能待开发*****//
	    	Room.getRoomNews({
				_id: ObjectID(roomId)
			}, { 
				chatmessage: {$slice: -100}
			}, function(err, result){
				if(err){
					return 
				}
		    	if(!chatMessage[roomId]){
		    		chatMessage[roomId] = [];
		    	}
		    	if(!result.chatmessage){
		    		result.chatmessage = [];
		    	}
		    	let chat = [...result.chatmessage, ...chatMessage[roomId]];
		        socket.emit('allMessages', {
		        	draw: Messages[roomId],
		        	vocable: vocable,
		        	chatMessage: chat
		        });
			})
	    });
	    
	    //用户发送的聊天信息
	    socket.on('chatMessage', function(message, fn){
	    	let Correct = false;
	    	//source为1.自己发的消息
	    	if(message.id != user._id){
	    		return fn(false);//回调，告诉客户端发送失败；
	    	}
	    	//判断是否猜中
	    	if(readyNum[roomId] && readyNum[roomId]['vocable'] && !!readyNum[roomId]['current']){
	    		//console.log(message.content, readyNum[roomId]['vocable'][0])
	    		if(message.content.indexOf(readyNum[roomId]['vocable'][0]) > -1){
	    			Correct = true;
	    			message.content = '******';
	    		}
	    	}
	    	
	    	message.time = new Date().getTime().toString();
	        socket.broadcast.to(roomId).emit('userMessage', message);
	    	fn(true);//回调，告诉客户端发送成功；
	    	
	    	//将消息先暂存
	    	if(!chatMessage[roomId]){
	    		chatMessage[roomId] = [];
	    	}
	    	chatMessage[roomId].push(message);
	    	
	    	//猜中通知
	    	if(readyNum[roomId] && !readyNum[roomId]['correct']){
	    		readyNum[roomId]['correct'] = [];
	    	}
	    	let correc_str = readyNum[roomId]['correct'].toString();
	        if(Correct && readyNum[roomId]['current'] != socket.id && correc_str.indexOf(socket.id) < 0){
	        	readyNum[roomId]['correct'].push(socket.id)
	        	let msg = {
	        		content: message.nick+'，猜中了。',
					head: "",
					id: "10000",
					nick: "系统消息",
					time: message.time
	        	};
	        	chatMessage[roomId].push(msg);
	        	io.sockets.in(roomId).emit('userMessage', msg);
	        	
	        	//全部猜中开始下一位
	        	if(readyNum[roomId]['correct'].length == roomInfo.gamepeople-1){
	        		for(let key in readyNum[roomId]['gameNum']){
	        			if(readyNum[roomId]['gameNum'][key].socketId == readyNum[roomId]['current']){
	        				readyNum[roomId]['next'] = 1;
	        			}
	        		}
	        	}
	        }
	    })
	    
	    //连接成功发送消息
	    socket.emit('reconnecp', {
	    	login: 1,
	    	msg: '连接成功'
	    });
	    
	    //断开连接监听
	    socket.on('disconnect', function(message){
	        //当用户断开连接，是在房间页面断线，房间在线人数加-1，满足房间人数+1
	        if(roomId){
		    	//离开房间删除
		    	for(let key in onlineNum[roomId]){
		    		if(user._id == onlineNum[roomId][key].id){
		    			onlineNum[roomId].splice(key, 1);
		    		}
		    	}
	    		//取消准备
		    	if(readyNum[roomId] && !readyNum[roomId]['current']){
		    		for(let key in readyNum[roomId]['gameNum']){
		    			if(readyNum[roomId]['gameNum'][key].userId == user._id){
		    				readyNum[roomId]['gameNum'].splice(key, 1);
		    			}
		    		}
		    	}
	    		io.sockets.in(roomId).emit('onlineNum', onlineNum[roomId]);
	    		Room.updateRoom({
					_id: ObjectID(roomId)
				}, {
					$set:{
						online: onlineNum[roomId].length,
						below: roomInfo.gamepeople - onlineNum[roomId].length
					}
				}, function(err, result){
					
				})
		    	//roomId = null;
	        }
	    });
	    
	    //倒计时
    	var timer = null;
	    function countDown(i, number){
	    	io.sockets.in(roomId).emit('countDown', {
	    		count: --i,
	    		number: number
	    	});
	    	if(i > 0 && readyNum[roomId]['next'] != 1){
	    		//发送第一次提示
	    		if(readyNum[roomId] && readyNum[roomId]['vocable'] && i == 60){
	    			io.sockets.in(roomId).emit('vocablePrompt', {
			    		prompt: readyNum[roomId]['vocable'][1][0]
			    	});
	    		}
	    		//发送第二次提示
	    		if(readyNum[roomId] && readyNum[roomId]['vocable'] && i == 35){
	    			io.sockets.in(roomId).emit('vocablePrompt', {
			    		prompt: readyNum[roomId]['vocable'][1][1]
			    	});
	    		}
	    		//25秒内没有操作换下一位用户
	    		if(Messages[roomId] && Messages[roomId].length < 1 && i == 65){
	    			clearTimeout(timer);
	    			startDraw(number, true);
	    		}else{
		    		timer = setTimeout(function(){
		    			countDown(i, number);
		    		}, 1000);
	    		}
	    	}else{
	    		readyNum[roomId]['next'] = 1;
    			clearTimeout(timer);
	    		startDraw(number);
	    	}
	    }
	    
	    //开始游戏
	    function startDraw(ci, no){
    		//清除画布信息
    		Messages[roomId] = [];
    		readyNum[roomId]['correct'] = [];
	    	if(ci >= readyNum[roomId]['start']){
	    		//发送正确答案
	    		if(readyNum[roomId]['next'] == 1){
	    			readyNum[roomId]['next'] = 0;
	    			let msg = {
	        			content: '正确答案为‘ '+readyNum[roomId]['vocable'][0]+' ’，游戏结束。',
						head: "",
						id: "10000",
						nick: "系统消息",
						time: new Date().getTime().toString()
		        	};
	        		chatMessage[roomId].push(msg);
		    		io.sockets.in(roomId).emit('userMessage', msg);
	    		}
	    		//游戏结束
	    		Room.updateRoom({
					_id: ObjectID(roomId)
				}, {
					$set: {ingame: 0},
					$pushAll: {chatmessage: chatMessage[roomId]}
				}, function(err, result){
		    		//取消准备
		    		for(let key in onlineNum[roomId]){
	    				onlineNum[roomId][key].ready = false;
		    		}
		    		//从准备数组中删除
		    		readyNum[roomId]['vocable'] = null;
		    		readyNum[roomId]['current'] = null;
		    		readyNum[roomId]['gameNum'] = [];
		    		//消息清空
		    		chatMessage[roomId] = [];
		    		io.sockets.in(roomId).emit('onlineNum', onlineNum[roomId]);
					io.sockets.in(roomId).emit('endGame');
				})
	    	}else{
	    		//随机取四个词语
	    		var gameVocable = []
	    		for(let key in Vocable){
	    			let i = RandomNum(0, Vocable.length);
	    			var j = RandomNum(0, Vocable[i].length);
	    			gameVocable.push(Vocable[i][j]);
	    		}
	    		//下一位
	    		if(!readyNum[roomId]['gameNum']){
	    			return startDraw(readyNum[roomId]['start']);
	    		}
	    		//发送正确答案
	    		if(readyNum[roomId]['next'] == 1){
	    			readyNum[roomId]['next'] = 0;
		    		io.sockets.in(roomId).emit('userMessage', {
		        		content: '正确答案为‘ '+readyNum[roomId]['vocable'][0]+' ’，开始下一位。',
						head: "",
						id: "10000",
						nick: "系统消息",
						time: new Date().getTime().toString()
		        	});
	    		}
	    		readyNum[roomId]['current'] = readyNum[roomId]['gameNum'][ci].socketId;
	    		io.sockets.in(readyNum[roomId]['gameNum'][ci].socketId).emit('Vocable', {
	    			vocable: gameVocable
	    		});
	    		io.sockets.in(readyNum[roomId]['gameNum'][ci].socketId).emit('onlineNum', onlineNum[roomId]);
	    		//no=true没有反应开始下一位
				io.sockets.in(roomId).emit('nextBit', {
	    			type: 'clearCanvas',
	    			no: no,
	    			count: ci,
	    			id: readyNum[roomId]['gameNum'][ci].socketId
	    		});
		    	countDown(90, ++ci);
	    	}
	    }
	    
	    //返回min ≤ r < max随机数
		function RandomNum(Min, Max){
		  	var Range = Max - Min;
	      	var Rand = Math.random();
	      	var num = Min + Math.floor(Rand * Range); //舍去
	      	return num;
		}
	});
}