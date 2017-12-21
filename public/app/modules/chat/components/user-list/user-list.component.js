
/**
 * Created by maulikpatel on 13/6/16.
 */
(function () {
    'use strict';
    angular
        .module('UserChat',[])
        .directive('userChat', Directive);
    Controller.$inject = ['$scope', 'lodash','ChatService'];

    /**
     * @method Directive
     * @description directive to manage the advertisements
     * @constructor
     */
    function Directive() {
        return {
            restrict:'E',
            replace:true,
            templateUrl:'/app/modules/chat/components/user-list/user-list.component.html',
            controller:Controller,
            controllerAs:'vm',
            bindToController:true
        };
    }
    /**
     * @method Controller
     * @description controller to managet the advertisements
     * @constructor
     * @ticket: BOMB-3280
     */
    function Controller($scope, _,ChatService) {
        var vm = this;

        activate();

        /**
         * @method activate
         * @description function will call on load to get banners
         * @ticket BOMB-1491, BOMB-1933
         */
        function activate() {
            vm.userList = ChatService.userList();
            console.log(vm.userList);
        }
    }
})();