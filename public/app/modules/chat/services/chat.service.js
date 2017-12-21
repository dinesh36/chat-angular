'use strict';
(function(){
	angular
		.module('HTAdminApp')
		.factory('ChatService', ChatService);
	ChatService.$inject = ['$http', '$q','RoHttp','$rootScope'];
	function ChatService($http,$q,RoHttp,$rootScope){

		return {
            init:init,
			userList:userList
		};

		function init() {
			var socket = io();
			$rootScope.$on('SEND_MESSAGE', function(event,data){
				console.log(data.data);
				socket.emit('new message', data.data);
			});

			socket.on('new message', function (data) {
				console.log('here in message');
				console.log(data);
				$rootScope.$broadcast('NEW_MESSAGE', {action:'newMessage', data:data});
			});
            setInterval(function () {
                var data = {moduleId:1,name:'sagar', action:'created', createdBy:'Dinesh', moduleName:'Contact'};
                $rootScope.$broadcast('FEEDS', {action:'feeds', data:data});
            },1000);
        }

		function userList(){
			var data = [{id:1,name:'sagar'},
				{id:2,name:'Akshay'},
				{id:3,name:'Dinesh'},
				{id:4,name:'Rushi'},
				{id:5,name:'Savan'},
				{id:6,name:'Nirav'},
				{id:7,name:'Muit'}];
			return data;
		}
	}
})();