var Promise = require('bluebird');
var mongodb = require('./db');
var redis = require('./redis');


exports.Sign = function(){
	var promise = redis.setAsync('key', ['string']).then(function(res) { 
		return redis.getAsync('key');
		//返回 Promise 
	})
	.then(function(res) {
		console.log(res); //打印'string' Q.resolve(res);
		return res;
		//返回 Promise 
	})
	.error(function(error){
        return 'Promise Error:'+error;
    });
	return promise;
}



