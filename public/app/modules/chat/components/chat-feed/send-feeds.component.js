'use strict';
(function(){
    angular
        .module('SendFeeds', [])
        .directive('sendFeeds',directive);
    Controller.$inject = ['$state','lodash','$rootScope','$scope', 'ChatService'];


    function directive() {
        return {
            restrict:'E',
            replace:true,
            templateUrl:'/app/modules/chat/components/chat-feed/send-feeds.component.html',
            bindToController:true,
            controller:Controller,
            controllerAs:'vf'
        };
    }
    function Controller($state,_,$rootScope,$scope,ChatService){
        var vm = this;
        var listeners = [];
        vm.userFeeds = [];
        vm.fireEvent=fireEvent;
        activate();

        function fireEvent(name){
            var data = {};
            var action = '';
            switch(name){
                case 'Contact':
                    data={moduleId:1,name:'Akshay Kalola', action:'created', createdBy:'Dinesh', moduleName:'Contact'};
                    action='CONTACT_CREATED';
                    break;
                case 'Company':
                    data={moduleId:5,name:'Rapidops Inc', action:'created', createdBy:'Dinesh', moduleName:'Company'};
                    action='COMPANY_CREATED';
                    break;
                case 'Deal':
                    data={moduleId:4,name:'Meeting with Rushi Pandya', action:'created', createdBy:'Dinesh', moduleName:'Deal'};
                    action='DEAL_CREATED';
                    break;
                case 'Activity':
                    data={moduleId:2,name:'sagar', action:'created', createdBy:'Dinesh', moduleName:'Activity'};
                    action='ACTIVITY_CREATED';
                    break;
                case 'Email':
                    data={moduleId:3,name:'sagar', action:'sent', createdBy:'Dinesh', moduleName:'Email'};
                    action='EMAIL_CREATED';
                    break;
            }
            $rootScope.$broadcast('SEND_FEED',{action:action, data:data});
        }

        function activate() {
            ChatService.init();
        }
    }
})();