/**
 * Created by dinesh on 21/12/17.
 */
'use strict';
(function(){
    angular
        .module('ChatMain', [])
        .directive('chatMain',directive);
    Controller.$inject = ['$state','lodash','$rootScope','$scope', 'ChatService','$location'];


    function directive() {
        return {
            restrict:'E',
            scope :{
                id:'@id'
            },
            replace:true,
            templateUrl:'/app/modules/chat/components/chat-main/chat-main.component.html',
            bindToController:true,
            controller:Controller,
            controllerAs:'vm'
        };
    }
    function Controller($state,_,$rootScope,$scope, ChatService,$location){
        var vm = this;
        activate();

        function activate() {
            //$('.chat-icon').css('display', 'none');
            vm.name = 'sagar';
            vm.userId = $location.search().id;
        }
    }
})();