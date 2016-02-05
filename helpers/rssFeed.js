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

/*================
Select RSS sources
================*/

// JS Object to store RSS sources
var sources = {
    dogster:    'http://www.dogster.com/feed/',
    //dogtime:    'http://dogtime.com/feed',
    //barkpost:   'http://barkpost.com/feed/',
    //dogshaming: 'http://www.dogshaming.com/feed/'
};


/*==========
Get RSS data
==========*/

// For each site in the source list
for (site in sources) {
    
    // Notify console
    console.log(`Scanning ${site}: ${sources[site]}`);
    
    // Fetch XML data and convert to JSON
    xmlToJson(sources[site], function(err, data) {
                
        // Handle error
        if (err) {
            return console.err(err);
        }
        
        // Store RSS data
        var rssData = JSON.parse(data);
    });
}

/*===============================
Create documents per Posts schema
===============================*/

// Array to store documents
var docArr = [];

rssData.rss.channel[0].item.forEach(function(obj) {

    // Push document onto document array
    docArr.push({
        "title"     : obj.title[0],
        "url"       : obj.link[0],
        "img"       : "http://upload.wikimedia.org/wikipedia/commons/6/64/The_Puppy.jpg",
        "posted_by" : "Sniffdit"
    });
});



/*================================
Insert docs to DB if not duplicate
================================*/

























































// Unique filename
var rssFilename = 'rss' + Date.now() + '.json';

console.log('\nScanning the following sources for RSS data:');

for (site in sources) {
    
    console.log(`- ${site}: ${sources[site]}`);
    
    xmlToJson(sources[site], function(err, data) {
                
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