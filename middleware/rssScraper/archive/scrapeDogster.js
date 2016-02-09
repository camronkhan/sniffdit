/*=================
Import dependencies
=================*/

console.log('\nInitiating scrapeRssFeeds.js\n');
console.log('Importing dependencies...\n');

var fs = require('fs');
var parseString = require('xml2js').parseString;
var http = require('http');
var mongoose = require('mongoose');
var models = require('./../models/models');
var Post = mongoose.model('Post');

console.log('Dependencies imported\n');


/*================
Select RSS sources
================*/

// JS Object to store RSS sources
var source = { name : 'Dogster', url : 'http://www.dogster.com/feed/' };

/*===============
Parse XML to JSON
===============*/

function xmlToJson(url, callback) {
    
    // Fetch data
    var req = http.get(url, function(res) {
        
        // Initialize xml container
        var xml = '';
        
        // Data event fires when chunk of data is downloaded
        res.on('data', function(chunk) {
            xml += chunk; 
        });
        
        // Error event fires when an error is thrown
        res.on('error', function(err) {
            callback(err, null);
        });
        
        // Timeout event fires when session timesout
        res.on('timeout', function(err) {
            callback(err, null); 
        });
        
        // End event fires when entire XML data has been retrieved
        res.on('end', function() {
            parseString(xml, function(err, result) {
                callback(null, result); 
            });
        });
    });
};


/*=========================
Prepare documents to upload
=========================*/

function prepDocs(data, callback) {

	// Array to store to-be-uploaded documents
	var docArray = [];

	// Iterate over each RSS post from each RSS source
	data.rss.channel.forEach(function(chnl) {
		chnl.item.forEach(function(itm) {

			// Create document from RSS data
			var currentDoc = {
				"title"		: itm.title[0],
				"source"    : chnl.title[0],
				"url"       : itm.link[0],
				"teaser"    : itm.description[0],
				"img"       : "http://www.lifewithdogs.tv/wp-content/uploads/2014/03/3.21.14-National-Puppy-Day22.jpg",
				"posted_by" : "Sniffdit"
			};

			// Push document onto array
			docArray.push(currentDoc);
		});
	});

	// Pass documents to-be-uploaded to callback
	callback(docArray);
};


/*===============
Insert docs in DB
===============*/

function insertDocs(docs, callback) {

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


/*===========
Connect to DB
===========*/

// Set database URI
//var dbURI = 'mongodb://heroku_7lc0mtlx:oprpm8qk1bsutacblsk6cli4d3@ds055555.mongolab.com:55555/heroku_7lc0mtlx';
var dbURI = 'mongodb://localhost:27017/sniffdit';

// Connect to DB
mongoose.connect(dbURI, function(err) {

	// Check connection status
	if (err) {
		// On connection error
		console.log(`Mongoose default connection error: ${err.message}\n`);
		console.log('Mongoose default connection disconnected\n');
		process.exit(0); 
	} else {
		// On successful connection
		console.log(`Mongoose default connection open to ${dbURI}\n`);
	}

	console.log(`Scanning ${source.name} (${source.url}) for RSS feed data\n`);

	// Convert fetched XML data to JSON
	xmlToJson(source.url, function(err, data) {

		// Check conversion status
		if (err) {
			// On conversion error
			console.log(`XML to JSON conversion error: ${err.message}\n`);
		} else {
			// On successful conversion
			console.log('RSS data successfully converted to JSON\n');
		}

		// Prepare list of documents to be inserted in DB
		prepDocs(data, function(docs) {

			// On successful preparation
			console.log('Documents ready to be inserted into DB\n');

			console.log('Inserting documents...\n')

			// Insert documents into DB
			insertDocs(docs, function(errArr, docArr) {

				// Report number of errors occurred during insertion
				console.log(`${errArr.length} error(s) occurred during insertion\n`);

				// If errors occurred, print to console
				if (errArr.length > 0) {
					console.log('Insertion errors:');
					console.log('-----------------');
					errArr.forEach(function(err) {
						console.log(err);
					});
				}

				// Report number of documents inserted to DB
				console.log(`${docArr.length} document(s) successfully inserted to DB\n`);

				// If documents inserted, print to console
				if (docArr.length > 0) {
					console.log('Inserted documents:');
					console.log('-------------------');
					docArr.forEach(function(doc) {
						console.log(`<${doc.source}> ${doc.title}`);
					});
				}

				// Close DB connection
				mongoose.connection.close(function () { 
				    console.log(`\nClosing Mongoose default connection to ${dbURI}\n`); 
				    console.log('Exiting scrapeRssFeeds.js\n');
				    process.exit(0);
				}); 			
			});
		});
	});
});