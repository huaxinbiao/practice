const mongodb = require('./db');

function User(user){
	this.mobile = user.mobile;
	this.password = user.password;
};

module.exports = User;

//储存用户信息
User.prototype.save = function(callback){
	//要存入数据库的用户文档
	var user = {
		mobile: this.mobile,
		password: this.password
	};
	//打开数据库
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		//读取user
		db.collection('users',function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			//将用户信息插入users
			collection.insert(user,{
				safe: true
			}, function(err, user){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null, user[0]);//成功！err为null，并返回储存后的用户文档
			});
		});
		
	});
};
