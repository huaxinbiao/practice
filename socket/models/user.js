const mongodb = require('./db');
const MongoClient = mongodb.MongoClient;
const mongoConnectUrl = mongodb.mongoConnectUrl;
const crypto = require('crypto');//加密

function User(user){
	this.mobile = user.mobile;
	this.password = user.password;
};

module.exports = User;

//储存用户信息
User.prototype.save = function(callback){
	//要存入数据库的用户文档
	let time = new Date().getTime().toString();
	let md5 = crypto.createHash('md5');
	let token = md5.update(time+this.password+'HUA').digest('hex');
	let user = {
		mobile: this.mobile,
		head: '',
		password: this.password,
		time: time,
		room: [],
		token: token,
		nick: nickName()
	};
	//打开数据库
	MongoClient.connect(mongoConnectUrl, function(err, db){
		if(err){
			return callback(err);
		}
		//读取user
		db.collection('users',function(err, collection){
			if(err){
				db.close();
				return callback(err);
			}
			//将用户信息插入users
			collection.insert(user,{
				safe: true
			}, function(err, user){
				db.close();
				if(err){
					return callback(err);
				}
				callback(null, user.ops[0]);//成功！err为null，并返回储存后的用户文档
			});
		});
		
	});
};

//读取用户信息
User.get = function(field, callback){
	//打开数据库
	MongoClient.connect(mongoConnectUrl, function(err, db){
		if(err){
			return callback(err);
		}
		//读取users集合
		db.collection('users',function(err, collection){
			if(err){
				db.close();
				return callback(err);
			}
			//查找用户名为name的一个文档
			collection.findOne(field, function(err, user){
				db.close();
				if(err){
					return callback(err);
				}
				callback(null, user);//成功！返回查询的用户信息
			})
		})
	});
};

//更新用户信息
User.update = function(field, data, callback){
	//打开数据库
	MongoClient.connect(mongoConnectUrl, function(err, db){
		if(err){
			return callback(err);
		}
		//读取users集合
		db.collection('users',function(err, collection){
			if(err){
				db.close();
				return callback(err);
			}
			//更新用户名为mobile的一个文档
			collection.update(field, data , {safe:true}, function(err, result){
				db.close();
				if(err){
					return callback(err);
				}
				callback(null, result);//成功！返回查询的用户信息
			})
		})
	});
};

function nickName(){
	var nickname = ['梦飞蝶幻',
	'阿蜜儿果小懒',
	'粉色小懒蝶',
	'清新的蜜蝶',
	'梦幻晓璇',
	'懵懂的小萝莉儿',
	'凉心的良心',
	'灰色小懒懒',
	'冰蓝水蜜桃',
	'天使之蝶',
	'偶似晓梦蝶',
	'懵懵懂懂的晓孩纸',
	'纸欣梦幻蝶',
	'懒洋洋地粉涩日纪',
	'你永遠還不起',
	'玩笑已过半',
	'依然、',
	'你给的失落',
	'唱情歌的人'];
	return nickname[RandomNum(0, nickname.length)];
}
//返回min < r ≤ max随机数
function RandomNum(Min, Max){
  	var Range = Max - Min;
  	var Rand = Math.random();
  	if(Math.round(Rand * Range) == 0){       
   	 	return Min + 1;
  	}
  	var num = Min + Math.round(Rand * Range);
  	return num;
}