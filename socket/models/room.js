/*
 * 游戏房间
 * 房间名称，创建时间，可容纳游戏人数，可容纳围观人数,房间用户基本信息的数组,1房主
 * name,time,gamepeople,watchpeople,gameuser,owner
 */
const mongodb = require('./db');
const ObjectID = require('mongodb').ObjectID;

//创建房间
exports.create = function (room, callback = function(){}){
	room.time = new Date().getTime().toString();
	room.watchpeople = 100;
	//打开数据库
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		//读取user
		db.collection('rooms', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			//将用户信息插入rooms
			collection.insert(room,{
				safe: true
			}, function(err, room){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null, room.ops[0]);//成功！err为null，并返回储存后的用户文档
			});
		});
	});
};


//获取房间列表
exports.getroom = function (roomId, callback = function(){}){
	//打开数据库
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		//读取users集合
		db.collection('rooms',function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			//查找全部房间
			//{_id: ObjectID("58fc9f26caee7c0edf3b5417")}
			//db.rooms.find({"_id" : ObjectId("58fb395e3422bf6079d795a8")})
			
			//根据房间id查用户房间的集合
			var RoomArray = addObjectID(roomId);
			//console.log(RoomArray)
			collection.find({
				_id: {
					"$in": RoomArray
				}
			}, {
                "name": 1,
                "gamepeople": 1,
                "owner": 1,
                "time": 1,
                "watchpeople": 1
			}).toArray(function(err, room){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null, room);//成功！返回查询的用户信息
			});
			
			
			//根据用户查房主的集合
			/*collection.find({
				owner: '15210213106'
			}, {
                "name": 1,
                "gamepeople": 1,
                "owner": 1,
                "time": 1,
                "watchpeople": 1
			}).toArray(function(err, room){
				mongodb.close();
				if(err){
					return callback(err);
				}
				console.log(room)
				callback(null, room);//成功！返回查询的用户信息
			});*/
		})
	});
}

//重排数组
function addObjectID(arr){
	let objId = [];
	for(let key in arr){
		let val = ObjectID(arr[key]);
		objId.push(val)
	}
	return objId;
}



