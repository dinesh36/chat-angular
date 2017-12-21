
/**
 * Created by maulikpatel on 13/6/16.
 */
(function () {
    'use strict';
    angular
        .module('MessageSender',[])
        .directive('messageSender', Directive);
    Controller.$inject = ['$scope', 'lodash','$rootScope','ChatService','$location'];

    /**
     * @method Directive
     * @description directive to manage the advertisements
     * @constructor
     */
    function Directive() {
        return {
            restrict:'E',
            replace:true,
            templateUrl:'/app/modules/chat/components/chat-message-sender/message-sender.component.html',
            controller:Controller,
            controllerAs:'vs',
            bindToController:true
        };
    }
    /**
     * @method Controller
     * @description controller to managet the advertisements
     * @constructor
     * @ticket: BOMB-3280
     */
    function Controller($scope, _,$rootScope,ChatService,$location) {
        var vm = this;
        vm.message='';
        vm.sendMessage = sendMessage;
        vm.uploadFile = uploadFile;
        vm.checkIfEnterKeyWasPressed = checkIfEnterKeyWasPressed;
        activate();

        /**
         * @method activate
         * @description function will call on load to get banners
         * @ticket BOMB-1491, BOMB-1933
         */
        function activate() {
console.log(123)
            $rootScope.$on('userChange',function(event, data){
                vm.toUser = data;
                console.log(12)
                //$scope.$apply();
            });
        }

        function checkIfEnterKeyWasPressed($event){
            var keyCode = $event.which || $event.keyCode;
            if (keyCode === 13) {
                sendMessage();
                // Do that thing you finally wanted to do
            }
        }

        function sendMessage(){
            var userId = $location.search().id;

            var obj = {
                text:vm.message,
                msgTo:vm.toUser.id,
                msgFrom:userId,
                type:1
            };
            if (vm.message) {
                $rootScope.$broadcast('SEND_MESSAGE',{action:'send',data:obj});
                vm.message = '';
                // setTimeout(() => ChatService.scrollToBottom(), 200);
            }
        }

        function uploadFile(){
            console.log('uploadFile')
        }
    }
})();