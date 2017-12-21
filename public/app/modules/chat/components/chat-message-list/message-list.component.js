
/**
 * Created by maulikpatel on 13/6/16.
 */
(function () {
    'use strict';
    angular
        .module('MessageList',[])
        .directive('messageList', Directive);
    Controller.$inject = ['$scope', 'lodash','$rootScope'];

    /**
     * @method Directive
     * @description directive to manage the advertisements
     * @constructor
     */
    function Directive() {
        return {
            restrict:'E',
            replace:true,
            templateUrl:'/app/modules/chat/components/chat-message-list/message-list.component.html',
            controller:Controller,
            controllerAs:'vl',
            bindToController:true
        };
    }
    /**
     * @method Controller
     * @description controller to managet the advertisements
     * @constructor
     * @ticket: BOMB-3280
     */
    function Controller($scope, _,$rootScope) {
        var vm = this;
        vm.messages = [];
        activate();

        /**
         * @method activate
         * @description function will call on load to get banners
         * @ticket BOMB-1491, BOMB-1933
         */
        function activate() {
            $rootScope.$on('SEND_MESSAGE',function(event,data){
                vm.messages.push(data.data);
            });
            $rootScope.$on('NEW_MESSAGE', function(event,data){
                vm.messages.push(data.data.message);
            });
        }
    }
})();