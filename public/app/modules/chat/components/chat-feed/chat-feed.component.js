'use strict';
(function(){
    angular
        .module('ChatFeed', [])
        .directive('chatFeed',directive);
    Controller.$inject = ['$state','lodash','$rootScope','$scope'];


    function directive() {
        return {
            restrict:'E',
            replace:true,
            templateUrl:'/app/modules/chat/components/chat-feed/chat-feed.component.html',
            bindToController:true,
            controller:Controller,
            controllerAs:'vm'
        };
    }
    function Controller($state,_,$rootScope,$scope){
        var vm = this;
        activate();

        function activate() {
            console.log('hisadfasdfasd');
            vm.name = 'sagar';
        }
    }
})();