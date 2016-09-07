var mongodb = require('./db');

//page查询页，strip返回条数，fgathering查询表，comment查询评论
function Page(name, page, strip, gathering, tag){
	this.page = page;
	this.name = name;
	this.strip = strip;
	this.gathering = gathering;
	this.tag = tag;
};

module.exports = Page;

//翻页
Page.prototype.find = function(callback){
    var page=this.page,
        name = this.name,
        strip = this.strip,
        gathering = this.gathering,
        comment = this.comment,
        tag = this.tag;

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
            if(tag){
                query.tags = {$in:[tag]};
            }
            if (name) {
                query.name = name;
            }
            //使用 count 返回特定查询的文档数 total
            collection.count(query, function (err, total) {
                //根据 query 对象查询，并跳过前 (page-1)*strip 个结果，返回之后的 strip 个结果
                collection.find(query, {
                  post:0,
                  comments:0
                }, {
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


//分页查询
Page.pei = function(req, res, name, strip, gathering, callback){
    if(req.query.page){
        var page = req.query.page;
    }else{
        var page = 1;
    }
    if(req.query.tag){
        var tag = req.query.tag;
    }else{
        var tag = null;
    }
    var post = new Page(name, page, strip, gathering, tag);
    post.find(function(err, posts, total){
        if(err){
            req.flash('error', err);
            return res.redirect('404');
        }
        if(posts.length==0 && page!=1){
            res.redirect('/blog/index?page=1');
        }
        var obj =  {
            posts: posts,
            total: Math.ceil(total/strip),
            page: parseInt(page)
        };
        callback(null, obj);
    });
}
