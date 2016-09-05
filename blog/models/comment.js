var mongodb = require('./db');

function Comment(name, title, day, comment){
	this.name = name;
	this.title = title;
	this.day = day;
	this.comment = comment;
};

module.exports = Comment;

//储存一条评论
Comment.prototype.save = function(callback){
    var name = this.name,
        day = this.day,
        title = this.title,
        comment = this.comment;
	//打开数据库
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
				$push: {comments: comment}
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


