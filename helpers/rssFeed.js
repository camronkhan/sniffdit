var fs = require('fs');
var parseString = require('xml2js').parseString;
var http = require('http');

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
}

/*====================
Set URLs & run function
====================*/

// JS Object to store RSS sources
var sources = {
    dogster:    'http://www.dogster.com/feed/',
    //dogtime:    'http://dogtime.com/feed',
    //barkpost:   'http://barkpost.com/feed/',
    //dogshaming: 'http://www.dogshaming.com/feed/'
};

// Unique filename
var rssFilename = 'rss' + Date.now() + '.json';

console.log('\nScanning the following sources for RSS data:');

for (key in sources) {
    
    console.log(`- ${key}: ${sources[key]}`);
    
    xmlToJson(sources[key], function(err, data) {
                
        // Handle error
        if (err) {
            return console.err(err);
        }
        
        var xmlData = JSON.stringify(data, null, 2);
        
        fs.appendFile(rssFilename, xmlData, function(err) {
            
            if (err) {
                return console.err(err);
            }
        });
    });
}

console.log(`\nScanning complete\n\nRSS data stored in ${rssFilename}\n`);