/**
 * Created by dinesh on 11/5/16.
 */
'use strict';
angular.module('htTabs', [])
    .directive('htTabs', Directive);
Controller.$inject = ['$state','lodash','$rootScope','$scope'];

/**
 * @method Directive
 * @description Directive to manage the ht-tabs
 * @constructor
 */
function Directive(){
    return {
        restrict: 'E',
        replace:true,
        scope:{
            tabs:'='
        },
        template:'<ul class="nav nav-tabs ht-tabs">'+
                    '<li role="presentation" ng-repeat="tab in vm.tabs" class="{{tab.isActive?\'active\':\'\'}}">'+
                        '<a title="{{tab.name}}" ui-sref="{{tab.url}}" >{{tab.name}}</a>'+
                    '</li>'+
                '</ul>',
        controller:Controller,
        controllerAs:'vm',
        bindToController:true
    };
}

/**
 * @method Controller
 * @description controller to manage the ht tabs directive
 * @constructor
 * @tickets: BOMB-2582
 */
function Controller($state,_,$rootScope,$scope){
    var vm = this;
    vm.setActiveMenu = setActiveMenu;
    vm.activate = activate;
    activate();

    /**
     * @method activate
     * @description function to be called when activate the controller
     */
    function activate() {
        //set the active menu
        setActiveMenu();
    }


    /**
     * @method setActiveMenu
     * @description function to set the active menu
     */
    function setActiveMenu(url) {
        url = url || $state.current.name;
        $state.go(url);
        _.each(vm.tabs, function (tab) {
            if(tab.urls){
                tab.isActive = tab.urls.indexOf(url)>-1;
            } else {
                tab.isActive = tab.url === url;
            }
        });
    }

    //sometimes tabs are added after sometime , after that need to set the active menu
    $scope.$watch('vm.tabs',function(){
        setActiveMenu();
    });

    //function to watch the state change event
    $rootScope.$on('$stateChangeSuccess',
        function(){
            setActiveMenu();
        });
}