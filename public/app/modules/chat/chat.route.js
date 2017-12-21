(function(){
	angular
		.module('HTAdminApp')
		.config(Config);
	Config.$inject = ['$stateProvider'];
	function Config($stateProvider){
		console.log('hello');
		$stateProvider
			.state('app.chat', {
				url:'/chat',
				template:'<chat-main></chat-main>'
			})
            .state('app.chatTemp', {
                url:'/chat-temp',
                templateUrl:'/app/modules/chat/template/chat-temp.html'
            })
	}
})();