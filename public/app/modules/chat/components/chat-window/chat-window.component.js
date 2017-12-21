/**
 * Created by dinesh on 21/12/17.
 */
'use strict';
(function(){
    angular
        .module('ChatWindow', [])
        .directive('chatWindow',directive);
    Controller.$inject = ['$state','lodash','$rootScope','$scope'];


    function directive() {
        return {
            restrict:'E',
            replace:true,
            templateUrl:'/app/modules/chat/components/chat-window/chat-window.component.html',
            bindToController:true,
            controller:Controller,
            controllerAs:'vw'
        };
    }
    function Controller($state,_,$rootScope,$scope){
        var vm = this;
        activate();

        function activate() {
            $rootScope.$on('userChange',function(event, data){
                console.log(data);
                vm.userName = data.name;
                //$scope.$apply();
            });
        }
    }
})();