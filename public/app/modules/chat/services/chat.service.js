'use strict';
(function(){
	angular
		.module('HTAdminApp')
		.factory('ChatService', ChatService);
	ChatService.$inject = ['$http', '$q','RoHttp','$rootScope'];
	function ChatService($http,$q,RoHttp,$rootScope){

		return {
            init:init
		};

		function init() {
            setInterval(function () {
                var data = {id:1,name:'sagar', module:'deal'};
                $rootScope.$broadcast('FEEDS', {action:'feeds', data:data});
            },1000);
        }
	}
})();