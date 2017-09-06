redditApp.factory('posts', function($http,$rootScope){
	var posts = {};
	
	posts.getPosts=function(type){
		return $http.get('./curl.php?action=getPosts&type='+type)
			.then(function(response){
				$rootScope.error = true;
				$rootScope.showMessage = 'true';
				return response;
			},function(error){
				$rootScope.error = false;
				$rootScope.showMessage = 'false';
			});
	};

	posts.getComments=function(link){
		return $http.get('./curl.php?action=getComments&link='+link).then(function(response){
				$rootScope.error = true;
				$rootScope.showMessage = 'true';
				return response;
			},function(error){
				$$rootScope.error = false;
				$rootScope.showMessage = 'false';
			});
	};

	posts.getMoreComments = function(children,depth,linkid){
		var postdata = {linkid:linkid,sort:'confidence',children:children.toString(),depth: depth,limitchildren:'False'};
		return $http({method: "POST", url: './curl.php', data: postdata }).
			then(function(data){
				$rootScope.error = false;
				return data;
			},function(){
				$rootScope.error = true;
			});
	}

	return posts;
});