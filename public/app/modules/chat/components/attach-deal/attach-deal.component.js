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
        vm.closeDialog = closeDialog;
        activate();

        function activate() {
            vm.dealList = [{id:611, title:'Custom colored bullets', value:2500},{id:610, title:'David Fairclough Deal', value:2520},{id:597, title:'iPhone deal', value:250},{id:586, title:'test deal with this page', value:2100},
                {id:604, title:'Only Won', value:250550},{id:601, title:'Deal', value:232500},{id:612, title:'overdue deal', value:13300},{id:590, title:'call today', value:100}];
            console.log(vm.dealList)
        }

        function selectDeal(deal){
            $scope.closeThisDialog({deal:deal});
        }

        function closeDialog(){
            $scope.closeThisDialog(0);
        }
    }
})();