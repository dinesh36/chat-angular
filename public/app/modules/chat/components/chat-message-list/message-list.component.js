
/**
 * Created by maulikpatel on 13/6/16.
 */
(function () {
    'use strict';
    angular
        .module('MessageList',[])
        .directive('messageList', Directive);
    Controller.$inject = ['$scope', 'lodash','$rootScope','$location','ChatService'];

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
    function Controller($scope, _,$rootScope,$location,ChatService) {
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
                if(data.data){
                    if(data.data.msgFrom == $location.search().id){
                        data.data.isLoggingUser = true;
                    } else {
                        data.data.isLoggingUser = false;
                    }
                }
                vm.messages.push(data.data);
                $scope.$apply();
            });
            $rootScope.$on('NEW_MESSAGE', function(event,data){
                if(data.data.message){
                    if(data.data.message.msgFrom == $location.search().id){
                        data.data.message.isLoggingUser = true;
                    } else {
                        data.data.message.isLoggingUser = false;
                    }
                }
                vm.messages.push(data.data.message);
                $scope.$apply();
            });
            $rootScope.$on('userChange',function(event, data){
                setTimeout(function(){
                    var height = $(".chattext-list").prop("scrollHeight");
                    $('.chattext-list').scrollTop(height);
                },100)
                vm.messages = [];
                //$scope.$apply();
                ChatService.getMessages(data).then(function(data){
                    _.forEach(data.data, function(data){
                        if(data.msgFrom == $location.search().id){
                            data.isLoggingUser = true;
                        } else {
                            data.isLoggingUser = false;
                        }
                        vm.messages.push(data);
                    });
                });
            });

        }
    }
})();