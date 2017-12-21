
/**
 * Created by maulikpatel on 13/6/16.
 */
(function () {
    'use strict';
    angular
        .module('MessageSender',[])
        .directive('messageSender', Directive);
    Controller.$inject = ['$scope', 'lodash'];

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
    function Controller($scope, _) {
        var vm = this;
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

        function sendMessage(form){
            console.log(vm.message);
            console.log(vm.message);

        }

        function uploadFile(){
            console.log('uploadFile')
        }
    }
})();