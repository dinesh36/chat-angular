/**
 * Created by dinesh on 21/12/17.
 */
'use strict';
(function(){
    angular
        .module('ChatMain', [])
        .directive('chatMain',directive);
    Controller.$inject = ['$state','lodash','$rootScope','$scope', 'ChatService'];


    function directive() {
        return {
            restrict:'E',
            replace:true,
            templateUrl:'/app/modules/chat/components/chat-main/chat-main.component.html',
            bindToController:true,
            controller:Controller,
            controllerAs:'vm'
        };
    }
    function Controller($state,_,$rootScope,$scope, ChatService){
        var vm = this;
        activate();

        function activate() {
            vm.name = 'sagar';
            ChatService.init();
        }
    }
})();