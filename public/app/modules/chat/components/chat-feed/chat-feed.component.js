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
        var listeners = [];
        vm.userFeeds = [];
        activate();

        function activate() {
            $rootScope.$on('FEEDS',function(event, data){
                vm.userFeeds.push(data.data);
                $scope.$apply();
            });
        }
    }
})();