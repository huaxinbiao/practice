const mongodb = require('./db');
const MongoClient = mongodb.MongoClient;
const mongoConnectUrl = mongodb.mongoConnectUrl;
/**
 * 插入数据
 * @method insertData
 * @param {String} mongoConnectUrl 数据库连接
 * @param {String} coll 集合名称
 * @param {Array} data 插入的数据
 * @param {Function} callback 回调函数
 * @return {Null}
 *
 */
exports.insertData = function(coll, data, callback){
	MongoClient.connect(mongoConnectUrl, function(err, db){
		if(err) return console.log(err);
		// 打开集合
		var collection = db.collection(coll);
		// 插入数据
		collection.insertMany(data, function(err, result){
			//console.log(result)
			// 记得要关闭数据库
			db.close();
			callback(err, result);
		});
	});
}

/**
 * 查询数据
 * @method findData
 * @param {String} mongoConnectUrl 数据库连接
 * @param {String} coll 集合名称
 * @param {Object} opation 条件
 * @param {Function} callback 回调函数
 * @return {Null}
 *
 */
exports.findData = function (coll, opation, callback){
	MongoClient.connect(mongoConnectUrl, function(err, db){
		if(err) return console.log(err);
		// 打开集合
		var collection = db.collection(coll);
		// 根据条件查询数据
		var userData = collection.find(opation);
		// 遍历数据
		userData.toArray(function(err2, docs) {
			// docs是查询出来的文档，json对象，可以打印出来看看
			db.close();
			callback(err2, docs);
		});

	});
}

/**
 * @method deleteData
 * @param {String} mongoConnectUrl 数据库连接
 * @param {String} coll 集合名称
 * @param {Object} opation 条件
 * @param {Number} num 删除数据的数量，即删除几条
 * @return {Null}
 *
 */
exports.deleteData = function (coll, opation, num, callback){
	var i = num;
	var res = [];
	var tempRes = [];
	var thisFn = arguments.callee;
	MongoClient.connect(mongoConnectUrl, function(err, db){
		if(err) return console.log(err);

		var collection = db.collection(coll);
		if(i > 0){
			i--;
			collection.deleteOne(opation, function(err, result){
				// console.log(result)
				res.push(result);
				thisFn(mongoConnectUrl, coll, opation, i, callback);
				if(i == 0){
					db.close();
					tempRes = res;
					res = []
					i = 0;
					callback(err, tempRes);
				}
				
			});
		}

	});
}


/**
 * @method delupdateOneeteData
 * @param {String} mongoConnectUrl 数据库连接
 * @param {String} coll 集合名称
 * @param {Object} opation 条件
 * @param {Object} data 更新的数据
 * @return {Null}
 *
 */
exports.updateOne = function (coll, opation, data, callback){
	MongoClient.connect(mongoConnectUrl, function(err, db){
		if(err) return console.log(err);

		var collection = db.collection(coll);
		
		collection.updateOne(opation, { $set: data }, function(err, result) {
			db.close();
			callback(err, result);
		});

	});
}