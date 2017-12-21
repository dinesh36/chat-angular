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
            $rootScope.$on('RECEIVE_FEED',function(event, data){
                console.log(event)
                console.log(data)
                // var data = [{moduleId:1,name:'sagar', action:'created', createdBy:'Dinesh', moduleName:'Contact'},
                //     {moduleId:2,name:'sagar', action:'created', createdBy:'Dinesh', moduleName:'Activity'},
                //     {moduleId:3,name:'sagar', action:'sent', createdBy:'Dinesh', moduleName:'Email'},
                //     {moduleId:4,name:'sagar', action:'created', createdBy:'Dinesh', moduleName:'Deal'},
                //     {moduleId:5,name:'sagar', action:'created', createdBy:'Dinesh', moduleName:'Company'}];
                vm.userFeeds.push(data.data.message);
                // vm.userFeeds = data;
                $scope.$apply();
            });
        }
    }
})();