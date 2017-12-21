/**
 * Created by dinesh on 21/3/16.
 */
(function () {
    'use strict';
    angular
        .module('HTMediaManager')
        .directive('htMediaManager', Directive);

    function Directive() {
        return {
            restrict:'E',
            replace:true,
            templateUrl:'/admin/components/ht-media-manager/templates/index.html',
            controller:'MediaManagerController',
            bindToController:true,
            controllerAs:'vm'
        };
    }
})();