var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	title: String,
	url: {type: String, unique: true},
	img: String,
	posted_by: String,
	posted_on: {type: Date, default: Date.now}
});

mongoose.model('Post', postSchema);