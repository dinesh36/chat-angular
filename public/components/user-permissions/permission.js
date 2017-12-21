 /*
    Name : User Permission Component
    Description : This directive is used to built component for ensure user authorization based on tokens.
*/
(function(){
    'use strict';
    angular
        .module('userPermission',[])
        .directive('ensureAuthorized', EnsureAuthorized);

        function EnsureAuthorized(){
            var directive = {
                restrict: 'A',
                scope: {
                    ensureAuthorized: '@ensureAuthorized',
                    justDisable: '@justDisable'
                },
                controller: Controller,
                link:Link
            };
            return directive;
        }

        Controller.$inject = ['$rootScope'];

        function Controller($rootScope){
            this.allTokens = $rootScope.userProfile.allTokens;
        }

        function Link(scope,element,attr,ctrl) {
            var isTokenExist = ctrl.allTokens.indexOf(scope.ensureAuthorized);
            if(isTokenExist < 0){
                if(attr.justDisable === 'true'){
                    element.attr('disabled','disabled');
                } else {
                    element.remove();
                }
            }
        }

})();