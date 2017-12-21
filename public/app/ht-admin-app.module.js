'use strict';
(function(){
	angular.module('HTAdminAppTemplates', []);
	angular.module('HTAdminApp', [
		'HTAdminAppTemplates',
		'HTAdminServices',
		'ui.router',
		'angular-loading-bar',
		'ngLodash',
		'RapidGrid',
		'ngJsTree',
		'ui.sortable',
		'ngDialog',
		'ngCookies',
		'ngSanitize',
		'ngTagsInput',
		'ng-nestable',
		'RapidDateTimePicker',
		'UserAuthorization',
		'userPermission',
		'daterangepicker',
		'ui.bootstrap',
		'froala',
		'angular-jqcloud',
		'HTMediaManager',
		'RoServices',
		'htTabs',
		'ui.sortable', //BOMB-1484
		'isteven-multi-select', //BOMB-1484
		'Chat',
		'UserChat',
		'MessageList',
		'MessageSender',
		'ChatMain',
		'ChatFeed',
		'ChatWindow',
		'ChatIO',
        'SendFeeds',
        'ScreenPlayer',
		'ScreenShot'
	]);
})();