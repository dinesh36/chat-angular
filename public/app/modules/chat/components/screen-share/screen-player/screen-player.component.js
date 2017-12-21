/**
 * Created by dinesh on 21/12/17.
 */
'use strict';
(function(){
    angular
        .module('ScreenPlayer', [])
        .directive('screenPlayer',directive);
    Controller.$inject = ['$state','lodash','$rootScope','$scope'];


    function directive() {
        return {
            restrict:'E',
            replace:true,
            templateUrl:'/app/modules/chat/components/screen-share/screen-player/screen-player.component.html',
            bindToController:true,
            controller:Controller,
            controllerAs:'vf'
        };
    }
    function Controller($state,_,$rootScope,$scope){
        var vm = this;
        vm.closeDialog = closeDialog;
        vm.src = 'https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png';
        function closeDialog(){
            $scope.closeThisDialog(0);
        }
        activate();
        function activate() {
            $rootScope.$on('SCREEN_SHARE',function(event,data){
                $('.__src').attr('src',data.data.message);
            });
        }
    }
})();