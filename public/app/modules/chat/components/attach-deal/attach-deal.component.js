'use strict';
(function(){
    angular
        .module('AttachDeal', [])
        .directive('attachDeal',directive);
    Controller.$inject = ['$state','lodash','$rootScope','$scope', 'ChatService'];


    function directive() {
        return {
            restrict:'E',
            replace:true,
            templateUrl:'/app/modules/chat/components/attach-deal/attach-deal.component.html',
            bindToController:true,
            controller:Controller,
            controllerAs:'vf'
        };
    }
    function Controller($state,_,$rootScope,$scope,ChatService){
        var vm = this;
        var listeners = [];
        vm.dealList = [];
        vm.selectDeal = selectDeal;
        activate();

        function activate() {
            vm.dealList = [{id:1, title:'deal 1', value:2500},{id:2, title:'deal 2', value:2520},{id:3, title:'deal 3', value:250},{id:4, title:'deal 4', value:2100},
                {id:5, title:'deal 5', value:250550},{id:6, title:'deal 6', value:232500},{id:7, title:'deal 7', value:13300},{id:8, title:'deal 8', value:100}];
            console.log(vm.dealList)
        }

        function selectDeal(deal){
            $scope.closeThisDialog({deal:deal});
        }
    }
})();