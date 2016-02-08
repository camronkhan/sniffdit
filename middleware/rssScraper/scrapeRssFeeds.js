console.log('\n\n<---------- Processing Initiated ---------->\n');
console.log('Initiating scrapeRssFeeds.js\n');

// Import dependencies
var processSources = require('./helpers/processSources');
var mongoose = require('mongoose');

console.log('Dependencies imported\n');

// Select RSS sources
var sources = [
	{ 
		name : 'Dogster',
		url  : 'http://www.dogster.com/feed/'
	},
	{
		name : 'Barkpost',
		url  : 'http://barkpost.com/feed/'
	},
	{
		name: 'Dogshaming',
    	url: 'http://www.dogshaming.com/feed/'
	},
	{
		name: 'Life with Dogs',
    	url: 'http://www.lifewithdogs.tv/feed/'
    }
];

console.log('Sources to be scanned for RSS feed data:');
console.log('----------------------------------------');
sources.forEach(function(source) {
	console.log(`<${source.name}> ${source.url}`);
});
console.log('\nProcessing RSS data...\n');

// Set database URI
var dbURI = 'mongodb://heroku_7lc0mtlx:oprpm8qk1bsutacblsk6cli4d3@ds055555.mongolab.com:55555/heroku_7lc0mtlx';
//var dbURI = 'mongodb://localhost:27017/sniffdit';

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

	// Process provided sources to extract RSS data
	processSources(sources, function() {

		console.log('\n\n<---------- Processing Complete ---------->\n');

		// Disconnect from DB
		mongoose.connection.close(function () { 
		    console.log(`Closing Mongoose default connection to ${dbURI}\n`); 
		    console.log('Exiting scrapeRssFeeds.js\n');
		    process.exit(0);
		});
	});
});