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
				template:'<div>dinesh </div><chat-main>hello there</chat-main>'
			})
            .state('app.chatTemp', {
                url:'/chat-temp',
                templateUrl:'/app/modules/chat/template/chat-temp.html'
            })
	}
})();