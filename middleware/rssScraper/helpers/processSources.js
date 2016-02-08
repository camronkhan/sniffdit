var xmlToJson = require('./xmlToJson');
var prepDocList = require('./prepDocList');
var insertDocsToDb = require('./insertDocsToDb');

var processSources = function (sources, callback) {

	// Set counter to length of sources array
	var sourcesToScan = sources.length;

	// Scan each source
	sources.forEach(function(source) {

		// Convert fetched XML data to JSON
		xmlToJson(source.url, function(err, data) {

			// Check conversion status
			if (err) {
				// On conversion error
				console.log(`XML to JSON conversion error: ${err.message}\n`);
			}

			// Prepare list of documents to be inserted in DB
			prepDocList(data, function(docs) {

				// Insert documents into DB
				insertDocsToDb(docs, function(errArr, docArr) {

					console.log(`\n\n<---------- ${source.name} ---------->\n`);

					// Report number of errors occurred during insertion
					console.log(`${errArr.length} error(s) occurred during insertion\n`);

					// If errors occurred, print to console
					if (errArr.length > 0) {
						console.log('Insertion errors:');
						console.log('-----------------');
						errArr.forEach(function(err) {
							console.log(err);
						});
						console.log();
					}

					// Report number of documents inserted to DB
					console.log(`${docArr.length} document(s) successfully inserted into DB\n`);

					// If documents inserted, print to console
					if (docArr.length > 0) {
						console.log('Inserted documents:');
						console.log('-------------------');
						docArr.forEach(function(doc) {
							console.log(`<${doc.source}> ${doc.title}`);
						});
						console.log();
					}

					// Scan the next source
					scanNextSource();
				});
			});
		});
	});

	// Helper function to pass arrays to callback upon completion of forEach loop
	function scanNextSource() {
		
		// Decrement number of documents to scan
		sourcesToScan--;

		// If all documents have been scanned, pass arrays to callback
		if (sourcesToScan < 1) {
			callback();
		}
	};
};

module.exports = processSources;