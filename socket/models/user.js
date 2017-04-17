const mongoose = require('mongoose');
const Schema = mongoose.Schema

const User = new Schama({
	email: String,
	name: String,
	avatarUrl: String
});

module.exports = User
