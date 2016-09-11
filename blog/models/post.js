var mongodb = require('./db');

function Post(name, title, brief, tags, post){
	this.name = name;
	this.title = title;
	this.brief = brief;
    this.tags = tags.split(',');
	this.post = post;
};

module.exports = Post;

//储存一篇文章及其相关信息
Post.prototype.save = function(callback){
	var date = new Date();
	//储存各种时间格式
	var time = {
		date: date,
		year: date.getFullYear(),
		month: date.getFullYear() + "-" +(date.getMonth() + 1),
		day: date.getFullYear() + "-" +(date.getMonth() + 1) + "-" + date.getDate(),
		minute: date.getFullYear() + "-" +(date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" +(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())
	}
	
	//要存入数据库的用户文档
	var post = {
		name: this.name,
		time: time,
		title: this.title,
		brief: this.brief,
		tags: this.tags,
		post: this.post
	};
	//打开数据库
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		//读取posts集合
		db.collection('posts',function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			//将文档信息插入posts集合
			collection.insert(post,{
				safe: true
			}, function(err){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null);//成功！err为null，并返回储存后的用户文档
			});
		});
		
	});
};

//读取文章及其相关信息
Post.getAll = function(name, callback){
	//打开数据库
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		//读取posts集合
		db.collection('posts',function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if(name){
				query.name = name;
			}
			//根据query对象查询信息
			collection.find(query,{
                "title": 1,
                "time": 1,
                "name": 1
            }).sort({
				time: -1
			}).toArray(function(err, docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null, docs);//成功！以数组形式返回查询的结果
			});
		});
	});
};

//获取一篇文章
Post.getOne = function(name, day, title, callback){
	//打开数据库
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		//读取 posts 集合
		db.collection('posts', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			//根据用户名，发表日期及文章名进行查询
			collection.findOne({
				"name": name,
				"time.day": day,
				"title": title
			}, function(err, doc){
				if(err){
				    mongodb.close();
					return callback(err);
				}
                if(doc){
                    //更新文章内容
                    collection.update({
                        "name": name,
                        "time.day": day,
                        "title": title
                    }, {
                        $inc: {"pv": 1}
                    }, function(err){
                        mongodb.close();
                        if(err){
                            return callback(err);
                        }
                    });
                    callback(null,doc);
                }
			});
		});
	});
};

//编辑一篇文章
Post.update = function(name, day, title, brief, tags, post, callback){
	//打开数据库
    tags = tags.split(',');
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		//读取posts集合
		db.collection('posts', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			//更新文章内容
			collection.update({
				"name": name,
				"time.day": day,
				"title": title
			}, {
				$set: {brief: brief, tags: tags, post: post}
			}, function(err){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null);
			});
		});
	});
};

//删除一篇文章
Post.remove = function(name, day ,title, callback){
	//打开数据库
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		//读取posts集合
		db.collection('posts',function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			//根据用户名，日期和标题查找并删除一篇文章
			collection.remove({
				"name": name,
				"time.day": day,
				"title": title
			},{
				w:1
			}, function(err){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null);
			});
		});
	});
}
