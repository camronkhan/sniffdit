var express = require('express');
var router = express.Router();

/* GET all posts */
router.get('/posts', function(req, res, next) {
	Post.find(function(err, posts) {
		if (err) {
			return res.send(500, 'Error: No data to return');
		}
		return res.json(posts);
	});
});

module.exports = router;