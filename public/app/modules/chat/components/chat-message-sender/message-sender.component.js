
/**
 * Created by maulikpatel on 13/6/16.
 */
(function () {
    'use strict';
    angular
        .module('MessageSender',[])
        .directive('messageSender', Directive);
    Controller.$inject = ['$scope', 'lodash','$rootScope','ChatService'];

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
    function Controller($scope, _,$rootScope,ChatService) {
        var vm = this;
        vm.message='';
        vm.sendMessage = sendMessage;
        vm.uploadFile = uploadFile;
        activate();

        /**
         * @method activate
         * @description function will call on load to get banners
         * @ticket BOMB-1491, BOMB-1933
         */
        function activate() {

        }

        function sendMessage(){
            console.log('hi');
            if (vm.message) {
                $rootScope.$broadcast('SEND_MESSAGE',{action:'send',data:vm.message});
                vm.message = '';
                // setTimeout(() => ChatService.scrollToBottom(), 200);
            }
        }

        function uploadFile(){
            console.log('uploadFile')
        }
    }
})();