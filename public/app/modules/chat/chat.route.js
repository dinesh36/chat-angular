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
				template:'<div>dinesh </div><message-sender></message-sender>'
			})
	}
})();