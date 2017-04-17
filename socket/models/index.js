const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/27017')
exports.User = mongoose.model('User', require('./user'))
