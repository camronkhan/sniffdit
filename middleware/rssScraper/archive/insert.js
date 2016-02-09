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