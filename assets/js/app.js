var redditApp = angular.module('redditApp',['ui.router','ngImageAppear']);
redditApp.config(function($stateProvider,$urlRouterProvider) {
	$urlRouterProvider.otherwise("/");

	$stateProvider
		.state('home', {
            url: '/:type',
            views: {
                '': {
                    controller: 'mainController',
                    templateUrl: 'views/home.html',
                },                
            }
        })
        .state('post', {
            url: '/post/:type/:link',
            views: {
                '': {
                    controller: 'postController',
                    templateUrl: 'views/post.html',
                },                
            }
        })
});