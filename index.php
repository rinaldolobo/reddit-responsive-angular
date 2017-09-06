<!DOCTYPE html>
<html lang="en" ng-app="redditApp">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=6; IE=EDGE" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>reddit</title>

  <link rel='icon' href="./assets/images/reddit.ico" sizes="256x256" type="image/x-icon" />
  <link href="assets/css/bootstrap.min.css" rel="stylesheet">
  <link href="assets/css/style.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">
</head>
<body ng-cloak>
	<header>
		<div class="brand">
			<a ui-sref="home({'type':''})">
				<img src="./assets/images/reddit.svg" alt="" class="logo">
				<div class="brand-name">reddit</div>
			</a>
		</div>
		<ul class="nav nav-tabs">
			<li data-type="hot"><a ui-sref="home({'type':'hot'})">Hot</a></li>
			<li data-type="new"><a ui-sref="home({'type':'new'})">New</a></li>
			<li data-type="rising"><a ui-sref="home({'type':'rising'})">Rising</a></li>
			<li data-type="controversial"><a ui-sref="home({'type':'controversial'})">Controversial</a></li>
			<li data-type="top"><a ui-sref="home({'type':'top'})">Top</a></li>
		</ul>
	</header>
	<div class="view" ui-view=""></div>
	<div class="message" ng-class="{'is-shown': $root.showMessage=='true'}">
		<span ng-if="!$root.error">
			This is just a mock up with limited features. Go to <a href="http://www.reddit.com"><img src="./assets/images/reddit.svg" alt=""></a> for more fun stuff like commenting and sharing!
			<button class="btn btn-close-message" ng-click="$root.showMessage='false'">Keep exploring!</button>
		</span>
		<span class="has-error" ng-if="$root.error">
			Something went wrong. Retrying!
		</span>
	</div>
	<script src="./assets/js/jquery.min.js"></script>
	<script src="./assets/js/moment.js"></script>
	<script src="./assets/js/bootstrap.min.js"></script>
	<script src="./assets/js/angular-1.6.js"></script>
	<script src="./assets/js/angular-ui-router.js"></script>
	<script src="./assets/js/ng-image-appear.js"></script>
	<script src="assets/js/app.js"></script>
	<script src="controllers/controller.js"></script>
	<script src="factories/factory.js"></script>
</body>
</html>