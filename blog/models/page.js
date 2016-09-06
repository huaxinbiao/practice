var mongodb = require('./db');

//page查询页，strip返回条数，fgathering查询表，comment查询评论
function Page(name, page, strip, gathering){
	this.page = page;
	this.name = name;
	this.strip = strip;
	this.gathering = gathering;
};

module.exports = Page;

//翻页
Page.prototype.find = function(callback){
    var page=this.page,
        name = this.name,
        strip = this.strip,
        gathering = this.gathering,
        comment = this.comment;

    mongodb.open(function(err,db){
        if(err){
            req.flash('error', err);
            return res.redirect('/');
        }
        //读取 posts 集合
        db.collection(gathering, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (name) {
                query.name = name;
            }
            //使用 count 返回特定查询的文档数 total
            collection.count(query, function (err, total) {
                //根据 query 对象查询，并跳过前 (page-1)*strip 个结果，返回之后的 strip 个结果
                collection.find(query, {
                  skip: (page - 1)*strip,
                  limit: strip
                }).sort({
                  time: -1
                }).toArray(function (err, docs) {
                  mongodb.close();
                  if (err) {
                    return callback(err);
                  }
                  callback(null, docs, total);
                });
            });

        })
    })
}
