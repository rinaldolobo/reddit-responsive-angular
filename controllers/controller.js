redditApp.controller('mainController', function($scope,posts,$stateParams,$rootScope){
	$scope.posts;
	$scope.type = $stateParams.type?$stateParams.type:'hot';
	init();

	function init(){
		posts.getPosts($scope.type)
			.then(function(response){
				$scope.posts = response.data.data.children;
				$rootScope.error = false;
				$rootScope.showMessage = 'false';
			}, function(error){
				$rootScope.error = true;
				$rootScope.showMessage = 'true';
				init();
			});
	}
});

redditApp.controller('postController', function($compile,$scope,$rootScope,$stateParams,posts,$timeout,$sce,$window,$state){
	$scope.comments;
	$scope.completePost;
	$scope.preview = {
		'image':'',
		'text':'',
		'video':''
	};
	$scope.moreComments = [];
	$scope.link = $stateParams.link;

	init();

	function init(){
		posts.getComments($scope.link)
			.then(function(response){
				$rootScope.error = false;
				$rootScope.showMessage = 'false';
				$scope.comments = response.data[1].data.children;
				$scope.completePost = response.data[0].data.children[0];
				if($scope.completePost.data.preview){
					if(Object.keys($scope.completePost.data.media_embed).length!==0){
						$scope.preview.video = $sce.trustAsHtml(htmlDecode($scope.completePost.data.media_embed.content));
					}
					else if(Object.keys($scope.completePost.data.preview.images[0].variants).length===0){
						$scope.preview.image = $scope.completePost.data.preview.images[0].source.url;
					}
					else{
						$scope.preview.image = $scope.completePost.data.preview.images[0].variants.gif.source.url;
					}
				}
				else if($scope.completePost.data.selftext!=''){
					$scope.preview.text = $sce.trustAsHtml(htmlDecode($scope.completePost.data.selftext_html));
				}
				
			}, function(error){
				$rootScope.error = true;
				$rootScope.showMessage = 'true';
				$state.reload();
			});
	}

	$scope.getMoreComments = function(toggleId,children,depth,linkid,event){
		var toggleId = toggleId;
		var children = children;
		var depth = depth;
		var linkid = linkid;
		var event = event;
		var self = $(event.target).closest('.commentItem');

		$(self).html('loading').css('color','#ccc');

		posts.getMoreComments(children,depth,linkid)
			.then(function(response){
				var morecomments = angular.element(document.createElement('morecomments'));
				$scope.moreComments[toggleId] = response.data.jquery[response.data.jquery.length-1][response.data.jquery[response.data.jquery.length-1].length-1][0];
				$(morecomments).attr({'comment':"moreComments['"+toggleId+"']",'pid':toggleId,'toggle':'toggleVoteoption(target)'});
		      var el = $compile( morecomments )( $scope );
		      
		      $(morecomments).insertAfter(angular.element($(self)));
		      
		      $scope.insertHere = el;
		      $(self).remove();
		      $timeout(function(){
			      $('#'+toggleId).find('li').each(function(){
			      	var parent = $(this);
			      	var username = $(this).find('.username').find('.author').html();
			      	var votes = $(this).find('.username').find('.score.unvoted').html();
			      	var time = $(this).find('.username').find('time').html();
			      	$(this).find('.username').html(username);
			      	$(this).find('.score').html(votes);
			      	$(this).find('.username').removeClass('hidden');
			      	$('<span>'+time+'</span>').insertAfter($(this).find('.score'));

			      	$('#'+toggleId).find('li').each(function(){
			      		if($(parent).attr('data-name')==$(this).attr('data-parent-name')){
			      			var username1 = $(this).find('.username').find('.author').text();
					      	var votes1 = $(this).find('.username').find('.score.unvoted').html();
			      			var time1 = $(this).find('.username').find('time').html();
					      	$(this).find('.username').html(username1);
					      	$(this).find('.score').html(votes1);
					      	$(this).find('.username').removeClass('hidden');
					      	$('<span>'+time1+'</span>').insertAfter($(this).find('.score'));

			      			if($(parent).find('.commentList').length==0){
			      				$(parent).find('.comment-data').append('<ul class="commentList">'+$(this)[0].outerHTML+'</ul>');
			      				var el = $compile( $(parent).find('.comment-data').html() )( $scope );
			      				$scope.insertHere = el;
			      			}
			      			else{
			      				$(parent).find('.commentList').append($(this)[0].outerHTML);
			      				var el = $compile( $(parent).find('.commentList').html() )( $scope );
			      				$scope.insertHere = el;
			      			}
			      			$(this).remove();
			      		}
			      	});
			      });
		      },400);
			},function(){
				// $scope.getMoreComments(toggleId,children,depth,linkid,event);
			})
	}

	$scope.toggleVoteoption = function(target){
		if($('#collapse_'+target).hasClass('in')){
			$timeout(function(){
				$('[data-target=#collapse_'+target+']').find('img').attr('src','./assets/images/add.svg');
				$('[data-target=#collapse_'+target+']').parent().addClass('no-padding');
				$('#collapse_'+target).closest('.comment-item').prev().hide();
				if($window.innerWidth>768){
					$('#collapse_'+target).closest('.comment-item').parent().addClass('padding-adjust');
				}
			},300)
		}
		else{
			$('[data-target=#collapse_'+target+']').find('img').attr('src','./assets/images/remove.svg');
			$('[data-target=#collapse_'+target+']').parent().removeClass('no-padding');
			$timeout(function(){
				$('#collapse_'+target).closest('.comment-item').prev().show();
				if($window.innerWidth>768){
					$('#collapse_'+target).closest('.comment-item').parent().removeClass('padding-adjust');
				}
			},300)
		}
	}
});

redditApp.directive('morecomments', function ($compile) {
	return {
		template: '<div id="{{pid}}">'+
							'<li class="commentItem" data-name="{{comment.data.id}}" data-parent-name="{{comment.data.parent}}" ng-init="parentId=comment[$index-1].data.id" ng-repeat="comment in comment">'+
							'<div class="vote-option">'+
								'<img src="./assets/images/voteup.svg" alt="">'+
								'<img src="./assets/images/votedown.svg" alt="">'+
							'</div>'+
							'<div class="comment-item">'+
								'<div class="author-details">'+
									'<a data-target="#collapse_{{comment.data.id}}" data-toggle="collapse" ng-click="toggle({target:comment.data.id})">'+
										'<img src="./assets/images/remove.svg" class="collapseIcn" alt="">'+
									'</a>'+
									' <span class="username hidden" ng-bind-html="comment.data.content | renderHTMLCorrectly"></span>'+
									' <span class="score"></span>'+
								'</div>'+
								'<div class="comment-data collapse in" id="collapse_{{comment.data.id}}">'+
									'<span class="title">{{comment.data.contentText}}</span>'+
								'</div>'+
							'</div>'+
						'</li>'+
					'</div>',
		restrict: 'E',
		scope: {
			comment: '=',
			pid: '@',
			toggle: '&'
		},
		replace: true,
		link: function postLink(scope, element, attrs) {
			$compile(element.contents())(scope.$new());
		}
	};
});

redditApp.directive('submittedTime', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			date: '@'
		},
		template:'<span></span>',
		link: function(scope, element, attrs) {
			attrs.$observe('date',function(value){
				var postDate = new Date(1000*value);
				var minutes = moment().utc().diff(postDate.toUTCString(), 'minutes' , true);
				var message = Math.floor(minutes)<=0?'just now':minutes>60?Math.floor(minutes/60)==1?Math.floor(minutes/60)+' hour ago':Math.floor(minutes/60)+' hours ago':Math.floor(minutes)==1?Math.floor(minutes)+" min ago":Math.floor(minutes)+" mins ago";
				$(element).html(message);
			});
		}
	}
});

redditApp.filter('renderHTMLCorrectly', function($sce){
	return function(stringToParse)
	{
		return $sce.trustAsHtml(htmlDecode(stringToParse));
	}
});

redditApp.filter('thousandSuffix', function () {
	return function (input, decimals) {
		var exp, rounded,
		suffixes = ['k', 'M', 'B', 'T'];

		if(window.isNaN(input)) {
			return null;
		}

		if(input < 1000) {
			return input;
		}

		exp = Math.floor(Math.log(input) / Math.log(1000));

		return (input / Math.pow(1000, exp)).toFixed(decimals) + suffixes[exp - 1];
	};
});

redditApp.run(function($rootScope,$stateParams){
	$rootScope.showMessage = false;
	$rootScope.error = false;
	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		var type = toParams.type?toParams.type:'hot';
		$('.active').removeClass('active');
		$('[data-type='+type+']').addClass('active');
	});
})

function htmlDecode(input){
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}
