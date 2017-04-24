const validator = require('validator');//表单验证
const Room = require('../models/room.js');
const User = require('../models/user.js');


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
		Room.create({
			name: req.body.name,
			gamepeople: req.body.playersnumber,
			owner: user.mobile,
			gameuser:[{
				name: user.name,
				mobile: user.mobile,
				head: user.head,
				owner: 1
			}]
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
		Room.getroom(user.room, function(err, room){
			//当房间创建成功将房间id放入用户信息中
			if(err){
				return res.json({
					code: 200,
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
	})
}