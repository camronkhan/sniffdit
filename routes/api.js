var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

/* GET all posts */
router.get('/posts', function(req, res, next) {
	Post.find(function(err, posts) {
		if (err) {
			return res.send(500, 'Error: No data to return');
		}
		return res.json(posts);
	});
});

/* GET block of posts */
/*router.get('/posts', function(req, res, next) {
	// TODO
  	res.send({message: 'GET block of posts'});
});

/* GET post by id */
router.get('/posts/:id', function(req, res, next) {
	Post.findById(req.params.id, function(err, post) {
		if (err) {
			res.send(err);
		}
		res.json(post);
	});
});

/* POST */
router.post('/posts', function(req, res, next) {
	// Declare a new post obj
	var post = new Post({
		'title': req.body.title,
		'url': req.body.url,
		'img': req.body.img,
		'posted_by': req.body.posted_by
	});

	// Insert post into db
	post.save(function(err, post) {
		if (err) {
			return res.send(500, 'Error: Post was not saved');
		}
		return res.json(post);
	});
});

/* PUT */
router.put('/posts/:id', function(req, res, next) {
	Post.findById(req.params.id, function(err, post) {
		if (err) {
			res.send(err);
		}
		// Assign new values
		post.title = req.body.title;
		post.url = req.body.url;
		post.img = req.body.img;
		post.posted_by = req.body.posted_by;
		// Save new values to post
		post.save(function(err, post) {
			if (err) {
				res.send(err);
			}
			res.json(post);
		});
	});
});

/* DELETE */
router.delete('/posts/:id', function(req, res, next) {
	Post.remove({ _id: req.params.id }, function(err, results) {
		if (err) {
			res.send(err);
		}
		res.json("Post deleted");
	});
});

module.exports = router;