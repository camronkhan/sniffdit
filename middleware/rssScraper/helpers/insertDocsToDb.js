var mongoose = require('mongoose');
var models = require('./../../../models/models');
var Post = mongoose.model('Post');

var insertDocsToDb = function (docs, callback) {

	// Create array to store inserted docs
	var docsInserted = [];
	var errsOccurred = [];

	// Set counter to length of document array
	var docsToProcess = docs.length;

	// For each document in the array
	docs.forEach(function(doc) {

		// Set query criteria to compare URLs
		var query = { "url" : doc.url };

		// Set document to be inserted if unique
		var update = {
			"title"     : doc.title,
			"source"    : doc.source,
			"url"       : doc.url,
			"teaser"    : doc.teaser,
			"img"       : doc.img,
			"posted_by" : doc.posted_by
		};

		// Set options
		var options = {
			new    : true,  // Returns inserted document to callback
			upsert : true   // Inserts document to DB if not found
		};

		// Call Mongoose method on Post model to insert document if unique
		Post.findOneAndUpdate(query, update, options, function(err, doc) {

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