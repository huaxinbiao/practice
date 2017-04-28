const validator = require('validator');//表单验证
const Room = require('../models/room.js');
const User = require('../models/user.js');
const Basic = require('../models/basic.js');
const ObjectID = require('mongodb').ObjectID;


/*游戏房间*/
module.exports = function(app){
	app.post('/room/create', function(req, res){
		if(!validator.isLength(req.body.name, {min:2,max:12})){
			return res.json({
				code: 103,
				msg: '房间名字长度不正确'
			});
		}
		
		if([4,6,8,10].indexOf(parseInt(req.body.playersnumber)) == -1){
			return res.json({
				code: 103,
				msg: '游戏人数不正确'
			});
		}
		//创建房间，写入房间信息房主信息
		var complete = false;
		if(complete){
			return	res.json({
				code: 103,
				msg: '操作太频繁'
			});;
		}
		var user = req.session.user;
		//房间名字 、几人房、进入在线房间人数、差几人开始满足游戏人数、已准备人数、房主id、游戏开始状态、保存该房间的用户
		Room.createRoom({
			name: req.body.name,
			gamepeople: req.body.playersnumber,
			online: 0,
			below: req.body.playersnumber,
			ready: 0,
			owner: user._id,
			ingame: 0,
			gameuser:[user._id]
		}, function(err, room){
			//当房间创建成功将房间id放入用户信息中
			complete = true;
			User.update({
					mobile: user.mobile
				}, {
					$push:{"room": room._id}
				}, function(err, result){
					complete = false;
					req.session.user.room.push(room._id)
					res.status(200);
					res.json({
						code: 200,
						data: {
							id: room._id,
							name: room.name,
							playersnumber: room.gamepeople
						},
						msg: '新建房间成功'
					});
			})
		})
	})
	
	//获取当前用户房间列表
	app.get('/room/list', function(req, res){
		var user = req.session.user;
		let objId = [];
		for(let key in user.room){
			let val = ObjectID(user.room[key]);
			objId.push(val)
		}
		//获取房间列表
		Basic.findData('rooms', {
			_id: {
				"$in": objId
			}
		}, function(err, room){
			//当房间创建成功将房间id放入用户信息中
			if(err){
				return res.json({
					code: 103,
					msg: '获取房间列表错误'
				});
			}
			res.status(200);
			res.json({
				code: 200,
				data: room,
				msg: '获取房间列表成功'
			});
		})
	});
	
	//快速开始，获取一个未开始的游戏房间
	app.get('/room/quick', function(req, res){
		var user = req.session.user;
		//获取房间列表
		Room.RandomRoom({
			ingame: 0
		}, function(err, total, room){
			//当房间创建成功将房间id放入用户信息中
			if(err){
				return res.json({
					code: 103,
					msg: '进入房间失败'
				});
			}
			if(total == 0){
				return res.json({
					code: 103,
					msg: '进入房间失败，自己创建一个吧！'
				});
			}
			res.status(200);
			res.json({
				code: 200,
				data: room[0],
				msg: '进入房间成功'
			});
		})
	});
	
}