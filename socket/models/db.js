var settings = require('../settings'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Server;
//设置数据库，通过module.exports导出实例
module.exports = new Db(settings.db, new Server(settings.host, settings.port), {safe: true});