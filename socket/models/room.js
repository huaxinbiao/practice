/*
 * 游戏房间
 * 房间名称，创建时间，可容纳游戏人数，可容纳围观人数,房间用户基本信息的数组,1房主
 * name,time,gamepeople,watchpeople,gameuser,owner
 */
const mongodb = require('./db');
const MongoClient = mongodb.MongoClient;
const mongoConnectUrl = mongodb.mongoConnectUrl;
const crypto = require('crypto');//加密
const ObjectID = require('mongodb').ObjectID;

//创建房间
exports.createRoom = function (room, callback = function(){}){
	room.time = new Date().getTime().toString();
	room.watchpeople = 100;
	//打开数据库
	MongoClient.connect(mongoConnectUrl, function(err, db){
		if(err){
			return callback(err);
		}
		//读取rooms
		db.collection('rooms', function(err, collection){
			if(err){
				db.close();
				return callback(err);
			}
			//插入rooms信息
			collection.insert(room,{
				safe: true
			}, function(err, room){
				db.close();
				if(err){
					return callback(err);
				}
				callback(null, room.ops[0]);//成功！err为null
			});
		});
	});
};

//获取一个房间
exports.getRoomOne = function (roomId, callback = function(){}){
	//打开数据库
	MongoClient.connect(mongoConnectUrl, function(err, db){
		if(err){
			return callback(err);
		}
		//读取users集合
		db.collection('rooms',function(err, collection){
			if(err){
				db.close();
				return callback(err);
			}
			collection.findOne({
				_id: ObjectID(roomId)
			}, function(err, room){
				db.close();
				if(err){
					return callback(err);
				}
				callback(null, room);//成功
			})
		})
	});
}

//随机获取一个未开始游戏的房间
exports.RandomRoom = function(query, callback = function(){}){
	MongoClient.connect(mongoConnectUrl, function(err, db){
		if(err){
			return callback(err);
		}
		//读取rooms
		db.collection('rooms',function(err, collection){
			if(err){
				db.close();
				return callback(err);
			}
	        //使用 count 返回查询的文档数 total
	        collection.count(query, function (err, total) {
	            //根据 query 对象查询，并跳过前skip 个结果，返回之后的 limit 个结果
	            if(total == 0){
	            	return callback(null, total);
	            }
	            var Random = RandomNum(0, total);
	            collection.find(query, {
	            	gameuser: 0
	            },{
	              skip: Random-1,
	              limit: 1
	            }).toArray(function (err, room) {
	              db.close();
	              if (err) {
	                return callback(err);
	              }
	              callback(null, total, room);
	            });
	        });
		})
	});
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


