/*=================
Import dependencies
=================*/

console.log('\nInitiated scrapeRssFeeds.js\n');
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
var sources = [
	{
		name: 'Dogster',
    	url: 'http://www.dogster.com/feed/'
    }
    //{ dogtime      : 'http://dogtime.com/feed' },
    //{ barkpost     : 'http://barkpost.com/feed/'},
    //{ dogshaming   : 'http://www.dogshaming.com/feed/'},
    //{ lifewithdogs : 'http://www.lifewithdogs.tv/feed/'}
];

console.log('RSS sources to be scanned:');
sources.forEach(function(source) {
	console.log(`- ${source.name}: ${source.url}`);
});
console.log();


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

	// Scan RSS sources for data
	sources.forEach(function(source) {

		console.log('Scanning sources for RSS feed data\n');

		// Convert XML to JSON
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

				docs.forEach(function(obj) {
					console.log(JSON.stringify(obj));
				});

				//docs.forEach(function(doc) {
				//	console.log(`In main function: ${doc}\n`);
				//});


			});
		});
	});
});
