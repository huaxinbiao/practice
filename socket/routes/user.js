const validator = require('validator');//表单验证
const Room = require('../models/room.js');
const User = require('../models/user.js');
const Basic = require('../models/basic.js');
const ObjectID = require('mongodb').ObjectID;
const muilter = require('../models/multerUtil.js');
const path = require('path');
const fs = require('fs');
const images = require("images");

//个人信息
module.exports = function(app){
	//获取当前用户房间列表
	app.post('/user/setinfo', function(req, res){
		var user = req.session.user;
		if([1,2].indexOf(parseInt(req.body.type)) == -1){
			return res.json({
				code: 103,
				msg: '类型不正确'
			});
		}
		if(req.body.type == 1){
			if(!validator.isLength(req.body.value, {min:1,max:8})){
				return res.json({
					code: 103,
					msg: '昵称长度不正确'
				});
			}
			User.update({
				mobile: user.mobile
			}, {
				$set:{"nick": req.body.value}
			}, function(err, result){
				if(err){
					return res.json({
						code: 103,
						msg: '修改失败'
					});
				}
				req.session.user.nick = req.body.value;
				res.status(200);
				res.json({
					code: 200,
					data: {
						nick: req.session.user.nick
					},
					msg: '修改昵称成功'
				});
			})
		}
		if(req.body.type == 2){
			if(!validator.isLength(req.body.value, {min:1,max:20})){
				return res.json({
					code: 103,
					msg: '个性签名长度不正确'
				});
			}
			User.update({
				mobile: user.mobile
			}, {
				$set:{"individual": req.body.value}
			}, function(err, result){
				if(err){
					return res.json({
						code: 103,
						msg: '修改失败'
					});
				}
				req.session.user.individual = req.body.value;
				res.status(200);
				res.json({
					code: 200,
					data: {
						individual: req.session.user.individual
					},
					msg: '修改个性签名成功'
				});
			})
		}
	});
	
	//上传头像
	app.post('/user/upload', muilter.single('avatar'), function(req, res){
		//判断请求方式,获取token
		var token = req.body.token;
		var user = req.session.user;
		if(!token || user.token != token){
			return res.json({
				code: 104,
				msg: 'Token错误'
			});
		}
		if(user.token != token){
			req.session.user = null;
		}
		 // 没有附带文件
	  	if (!req.file) {
		    return res.json({
				code: 101,
				msg: '文件不存在'
			});
	  	}
		var extName = ''; //后缀名
        switch (req.file.mimetype) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }
        if (extName.length === 0) {
        	return res.json({
				code: 101,
				msg: '图片格式不正确'
			});
        }
	  	// 输出文件信息
//	  	console.log('====================================================');
//	  	console.log('fieldname: ' + req.file.fieldname);
//	  	console.log('originalname: ' + req.file.originalname);
//	  	console.log('encoding: ' + req.file.encoding);
//	  	console.log('mimetype: ' + req.file.mimetype);
//	  	console.log('size: ' + (req.file.size / 1024).toFixed(2) + 'KB');
//	  	console.log('destination: ' + req.file.destination);
//	  	console.log('filename: ' + req.file.filename);
//	  	console.log('path: ' + req.file.path);
		
		var createFolder = function(dirName){
		    try{
		        fs.accessSync(dirName, fs.F_OK);
		    }catch(e){
		        fs.mkdirSync(dirName);
		    }
		};
		
		var uploadFolder = './uploads/avatar/';
		createFolder(uploadFolder)
	  	// 移动文件
	  	let oldPath = path.join(req.file.path);
	  	let newPath = path.join(uploadFolder, req.file.filename);
	  	let min = uploadFolder+'min-'+req.file.filename;
	  	images(oldPath).resize(180, 180).save(min);
	  	fs.rename(oldPath, newPath, (err) => {
		    if (err) {
		      	console.log(err);
	        	return res.json({
					code: 101,
					msg: '上传失败'
				});
		    } else {
				User.update({
					mobile: user.mobile
				}, {
					$set:{
						"orihead": newPath,
						"head": min
					}
				}, function(err, result){
					if(err){
						return res.json({
							code: 103,
							msg: '修改失败'
						});
					}
					req.session.user.orihead = newPath;
					req.session.user.head = min;
					res.status(200);
		        	return res.json({
						code: 200,
						data: {
							orihead: req.session.user.orihead,
							head: req.session.user.head
						},
						msg: '上传成功'
					});
				})
		    }
	  	});
	})
}