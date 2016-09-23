var express = require('express');
var redis = require('./models/redis.js');

var app = express();
app.use(express.bodyParser());
