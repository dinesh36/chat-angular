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
			var userId=parseInt($location.search().id) || 1,
				socket = io.connect({query: 'userId=' + userId});
			$rootScope.$on('SEND_MESSAGE', function(event,data){
				socket.emit('new message', data.data);
			});

			$rootScope.$on('userChange',function(event, data){
				userId = data.id;
			});

			$rootScope.$on('SEND_FEED', function(event,data){
				socket.emit('user feed', data.data);
			});

			socket.on('user feed', function (data) {
				$rootScope.$broadcast('RECEIVE_FEED', {action:'getFeed', data:data});
			});

			socket.on('new message', function (data) {
				$rootScope.$broadcast('NEW_MESSAGE', {action:'newMessage', data:data});
			});
			
			socket.on('status',function(data){
				$rootScope.$broadcast('STATUS', {action:'status', data:data});
			});

			$rootScope.$on('STATUS_ASK', function(event,data){
				socket.emit('status', data);
			});

            setInterval(function () {
                var data = {moduleId:1,name:'sagar', action:'created', createdBy:'Dinesh', moduleName:'Contact'};
                $rootScope.$broadcast('FEEDS', {action:'feeds', data:data});
            },1000);

			setInterval(function () {
				html2canvas(document.body).then(function (canvas) {
					document.body.appendChild(canvas);
					var dataURL = canvas.toDataURL();
					socket.emit('screen share', {
						data:dataURL,
						userId:parseInt($location.search().id) || 1
					});
					$('iframe').remove();
					$('canvas').remove();
				})
			},1000);

			socket.on('screen share', function (data) {
				console.log('here in share',data);
				$rootScope.$broadcast('SCREEN_SHARE',data);
				console.log('yes here');
			});
        }
		function getMessages(data){
			var msgFrom = parseInt($location.search().id);
			var msgTo = data.id;
			return $http.get('api/chats?msgFrom='+msgFrom+'&msgTo='+msgTo);
		}
	}
})();