/*旧的连接方法*/
/*var settings = require('../settings'),
	Db = require('mongodb').Db,
	Connection = require('mongodb').Connection,
	Server = require('mongodb').Server;

module.exports = new Db(settings.db, new Server(settings.host, settings.port),{safe: true});*/

/*新的连接方法*/
const MongoClient = require('mongodb').MongoClient;
const mongoConnectUrl = 'mongodb://localhost:27017/chat';

module.exports = {  
    MongoClient,  
    mongoConnectUrl
};
/*MongoClient.connect(mongoConnectUrl, function(err, db){
	if(err) return console.log(err);
	console.log('连接成功');
});*/

