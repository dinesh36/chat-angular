
/**
 * Created by maulikpatel on 13/6/16.
 */
(function () {
    'use strict';
    angular
        .module('UserChat',[])
        .directive('userChat', Directive);
    Controller.$inject = ['$scope', 'lodash','ChatService','$location','$rootScope'];

    /**
     * @method Directive
     * @description directive to manage the advertisements
     * @constructor
     */
    function Directive() {
        return {
            restrict:'E',
            replace:true,
            templateUrl        :function getTemplate(element,attrs){
                if (attrs.showInChatWindow == 'false') {
                    return '/app/modules/chat/components/user-list/user-list.component.html';
                } else {
                    return '/app/modules/chat/components/user-list/mini-user-list.component.html';
                }
            },
            controller:Controller,
            controllerAs:'vu',
            bindToController:true
        };
    }
    /**
     * @method Controller
     * @description controller to managet the advertisements
     * @constructor
     * @ticket: BOMB-3280
     */
    function Controller($scope, _,ChatService,$location,$rootScope) {
        var vm = this;
        vm.userList = [
            {id:1,name:'sagar','active':false},
            {id:2,name:'Akshay','active':false},
            {id:3,name:'Dinesh','active':false},
            {id:4,name:'Rushi','active':false},
            {id:5,name:'Savan','active':false},
            {id:6,name:'Nirav','active':false},
            {id:7,name:'Muit','active':false}
        ];
        vm.users = {};
        vm.listView = true;
        vm.userDetails = userDetails;
        vm.getChatDetails = getChatDetails;
        activate();

        /**
         * @method activate
         * @description function will call on load to get banners
         * @ticket BOMB-1491, BOMB-1933
         */
        function activate() {
            var userId = $location.search().id;
            _.remove(vm.userList,{id:parseInt(userId)});
            getActiveUser(parseInt(vm.userList[0].id));
            var user = _.find(vm.userList, {id:parseInt(vm.userList[0].id)});
            console.log(user);
            setTimeout(function(){
                $rootScope.$broadcast('userChange',user)
            },1000);
        }

        function userDetails(user){
            //vm.userId = ;
            getActiveUser(parseInt(user.id));
            //vm.users = {users:vm.userList,id:vm.userId};
            $rootScope.$broadcast('userChange',user);
        }

        function getChatDetails(user){
            vm.listView = false;
        }

        function getActiveUser(id){
            _.forEach(vm.userList, function (list) {
                list.active = list.id === id;
            });
        }
    }
})();