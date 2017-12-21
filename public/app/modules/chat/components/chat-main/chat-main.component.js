/**
 * Created by dinesh on 21/12/17.
 */
'use strict';
(function(){
    angular
        .module('ChatMain', [])
        .directive('chatMain',directive);
    Controller.$inject = ['$state','lodash','$rootScope','$scope'];


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
    function Controller($state,_,$rootScope,$scope){
        var vm = this;
        activate();

        function activate() {
            console.log('hisadfasdfasd');
            vm.name = 'sagar';
        }
    }
})();