var mongoose = require('mongoose');
var models = require('./../../../models/post');
var Post = mongoose.model('Post');

var insertDocsToDb = function (docs, callback) {

	// Create array to store inserted docs
	var docsInserted = [];
	var errsOccurred = [];

	// Set counter to length of document array
	var docsToProcess = docs.length;

	// For each document in the array
	docs.forEach(function(doc) {

		// Create new post instance
		var newPost = new Post({
			"title"     : doc.title,
			"source"    : doc.source,
			"url"       : doc.url,
			"pub_date"  : doc.pub_date,
			"teaser"    : doc.teaser,
			"img"       : doc.img,
			"posted_by" : doc.posted_by
		});

		// Insert post
		newPost.save(function (err, newPost) {
			
			// Check insertion status
			if (err) {
				// On insertion error, push error to array
				errsOccurred.push(err);
			} else {
				// On successful insertion, push doc to array
				docsInserted.push(doc);
			}

			// Process the next document
			processNextDoc();
		});
	});

	// Helper function to pass arrays to callback upon completion of forEach loop
	function processNextDoc() {
		
		// Decrement number of documents to process
		docsToProcess--;

		// If all documents have been processed, pass arrays to callback
		if (docsToProcess < 1) {
			callback(errsOccurred, docsInserted);
		}
	};
};

module.exports = insertDocsToDb;