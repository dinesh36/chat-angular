(function(){
	angular
		.module('HTAdminApp')
		.config(Config);
	Config.$inject = ['$stateProvider'];
	function Config($stateProvider){
		$stateProvider
			.state('app.chat', {
				url:'/chat',
				template:'<chat-main></chat-main>'
			})
            .state('app.chatTemp', {
                url:'/chat-temp',
                templateUrl:'/app/modules/chat/template/chat-temp.html'
            })
            .state('app.sendFeeds', {
                url:'/send-feeds',
                template:'<send-feeds></send-feeds>'
            })
			.state('app.screen-share', {
				url:'/screen-share',
				template:'<screen-player></screen-player>'
			})
            .state('app.dealDetail', {
                url:'/detail/:id',
                templateUrl:'/app/modules/chat/components/deal/template/deal-detail.html',
                controller: 'DealDetailController',
                controllerAs:'vm'
            })
	}
})();