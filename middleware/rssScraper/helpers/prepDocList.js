var prepDocList = function (data, callback) {

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
				"pub_date"  : itm.pubDate[0],
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

module.exports = prepDocList;