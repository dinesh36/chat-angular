(function(){
	angular
		.module('HTAdminApp')
		.config(Config);
	Config.$inject = ['$stateProvider'];
	function Config($stateProvider){
		$stateProvider
			.state('app.chat', {
				url:'/chat',
				template:'<div>dinesh </div><chat-feed></chat-feed>'
			})
	}
})();