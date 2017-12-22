/**
 * Created by dinesh on 21/12/17.
 */
'use strict';
(function(){
    angular
        .module('ChatWindow', [])
        .directive('chatWindow',directive);
    Controller.$inject = ['$state','lodash','$rootScope','$scope','ngDialog'];


    function directive() {
        return {
            restrict:'E',
            replace:true,
            templateUrl:'/app/modules/chat/components/chat-window/chat-window.component.html',
            bindToController:true,
            controller:Controller,
            controllerAs:'vw'
        };
    }
    function Controller($state,_,$rootScope,$scope,ngDialog){
        var vm = this;
        vm.openScreenShare = openScreenShare;
        activate();

        function activate() {
            $rootScope.$on('userChange',function(event, data){
                $scope.userId = data.id;
                vm.userName = data.name;
                $scope.$apply();
            });
        }

        function openScreenShare(){
            if(!ngDialog.isOpen()){
                var dialog = ngDialog.open({
                    template:'<screen-player></screen-player>',
                    plain:true,
                    showClose   :false,
                    scope       :$scope,
                    className   :'ngdialog-theme-default width-small',
                    controller  :{},
                    controllerAs:'vm',
                    closeByDocument:false,
                    closeByEscape:false,
                    resolve     :{}
                });
                dialog.closePromise.then(function (data){
                    if(data && data.value && typeof data.value == 'object' && Object.keys(data.value).length){ //added condition to stop unnecessary api call by calling RefreshEmail function
                        var obj = {
                            text:data.value.deal,
                            msgTo:vm.toUser.id,
                            msgFrom:parseInt(userId),
                            type:3
                        };
                        if (data.value) {
                            $rootScope.$broadcast('SEND_MESSAGE',{action:'send',data:obj});
                            vm.message = '';
                            // setTimeout(() => ChatService.scrollToBottom(), 200);
                        }
                    }
                });
            }
        }
    }
})();