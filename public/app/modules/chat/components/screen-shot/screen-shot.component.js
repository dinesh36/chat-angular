/**
 * Created by dinesh on 21/12/17.
 */
'use strict';
(function(){
    angular
        .module('ScreenShot', [])
        .directive('screenShot',directive);
    Controller.$inject = ['$state','lodash','$rootScope','$scope'];


    function directive() {
        return {
            restrict:'E',
            replace:true,
            templateUrl:'/app/modules/chat/components/screen-shot/screen-shot.component.html',
            bindToController:true,
            controller:Controller,
            controllerAs:'vm'
        };
    }
    function Controller($state,_,$rootScope,$scope){
        var vm = this;
        activate();
        function activate() {}
    }
})();