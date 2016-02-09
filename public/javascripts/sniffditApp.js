var app = angular.module('sniffditApp', ['ngRoute', 'ngResource']).run(function($http, $rootScope) {
});

// Configure routing for views and controllers
app.config(function($routeProvider) {
	$routeProvider
		// Content display
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		});
});

app.factory('postService', function($resource) {
	return $resource('/api/posts/:id')
});

app.controller('mainController', function($scope, postService) {
	$scope.posts = postService.query();
	$scope.newPost = { title: '', url: '', pub_date: '', img: '', posted_by: '', posted_on: '' };

	$scope.post = function(){
		$scope.newPost.posted_by = $rootScope.current_user;
		$scope.newPost.posted_on = Date.now();
		postService.save($scope.newPost, function() {
			$scope.posts = postService.query();
			$scope.newPost = { title: '', url: '', pub_date: '', img: '', posted_by: '' };
		});
	};

	$scope.delete = function(post) {
		postService.delete({id: post._id});
		$scope.posts = postService.query();
	};

});