'use strict';
(function(){
	angular
		.module('HTAdminApp')
		.factory('ChatService', ChatService);
	ChatService.$inject = ['$http', '$q','RoHttp'];
	function ChatService($http,$q,RoHttp){
		console.log('hello');
	}
})();