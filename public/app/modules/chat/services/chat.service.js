'use strict';
(function(){
	angular
		.module('HTAdminApp')
		.factory('ChatService', ChatService);
	ChatService.$inject = ['$http', '$q','RoHttp','$rootScope','$location'];
	function ChatService($http,$q,RoHttp,$rootScope,$location){

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

			setInterval(function () {
				html2canvas(document.body).then(function (canvas) {
					document.body.appendChild(canvas);
					var dataURL = canvas.toDataURL();
					socket.emit('screen share', dataURL);
					$('iframe').remove();
					$('canvas').remove();
				})
			},1000);
        }
		function getMessages(data){

			console.log(data);
			console.log('msgFrom',parseInt($location.search().id));
			console.log('msgTo',data.id);
			var msgFrom = parseInt($location.search().id);
			var msgTo = data.id;
			return $http.get('api/chats?msgFrom='+msgFrom+'&msgTo='+msgTo);
		}
	}
})();