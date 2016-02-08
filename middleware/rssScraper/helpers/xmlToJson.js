var parseString = require('xml2js').parseString;
var http = require('http');

var xmlToJson = function (url, callback) {
    
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

module.exports = xmlToJson;