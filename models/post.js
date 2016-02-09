var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	title     : String,
	source    : String,
	url       : { type: String, unique: true },
	teaser    : String,
	img       : String,
	posted_by : String,
	posted_on : { type: Date, default: Date.now }
});

mongoose.model('Post', postSchema);