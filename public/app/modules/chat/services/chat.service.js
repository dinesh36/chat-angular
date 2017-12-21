'use strict';
(function(){
	angular
		.module('HTAdminApp')
		.factory('ChatService', ChatService);
	ChatService.$inject = ['$http', '$q','RoHttp','$rootScope'];
	function ChatService($http,$q,RoHttp,$rootScope){

		return {
            init:init,
			getMessages:getMessages
		};

		function init() {
			var socket = io();
			$rootScope.$on('SEND_MESSAGE', function(event,data){
				socket.emit('new message', data.data);
			});

			$rootScope.$on('SEND_FEED', function(event,data){
				console.log('send feed for the user feed.',data.data);
				socket.emit('user feed', data.data);
			});

			socket.on('user feed', function (data) {
				console.log('got feed for the user feed.',data);
				$rootScope.$broadcast('RECEIVE_FEED', {action:'getFeed', data:data});
			});

			socket.on('new message', function (data) {
				console.log('sdhdjsadjhasdas',data);
				$rootScope.$broadcast('NEW_MESSAGE', {action:'newMessage', data:data});
			});

            setInterval(function () {
                var data = {moduleId:1,name:'sagar', action:'created', createdBy:'Dinesh', moduleName:'Contact'};
                $rootScope.$broadcast('FEEDS', {action:'feeds', data:data});
            },1000);
        }

		function getMessages(){
			//$http.get('api/chats?msgFrom=')
			//	.then(function(){
            //
			//	})
		}
	}
})();