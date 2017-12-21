
/**
 * Created by maulikpatel on 13/6/16.
 */
(function () {
    'use strict';
    angular
        .module('MessageSender',[])
        .directive('messageSender', Directive);
    Controller.$inject = ['$scope', 'lodash','$rootScope','ChatService','$location'];

    /**
     * @method Directive
     * @description directive to manage the advertisements
     * @constructor
     */
    function Directive() {
        return {
            restrict:'E',
            replace:true,
            templateUrl:'/app/modules/chat/components/chat-message-sender/message-sender.component.html',
            controller:Controller,
            controllerAs:'vz',
            bindToController:true
        };
    }
    /**
     * @method Controller
     * @description controller to managet the advertisements
     * @constructor
     * @ticket: BOMB-3280
     */
    function Controller($scope, _,$rootScope,ChatService,$location) {
        var vm = this;
        var certificateFiles = [],
            companyInfoFiles = [];
        var userId = $location.search().id;

        vm.message='';
        vm.dropzoneConfig = {};
        vm.companyInfoFilesDropZone = {};
        vm.certificateFilesDropZone = {};
        vm.sendMessage = sendMessage;
        vm.uploadFile = uploadFile;
        vm.checkIfEnterKeyWasPressed = checkIfEnterKeyWasPressed;
        activate();

        /**
         * @method activate
         * @description function will call on load to get banners
         * @ticket BOMB-1491, BOMB-1933
         */
        function activate() {
            var acceptedFiles = [
                'application/pdf',
                'image/png',
                'image/jpg',
                'image/jpeg',
                'image/gif',
                'image/bmp',
                'image/x-windows-bmp',
                'image/x-icon'
            ];
            // setTimeout(function(){
            vm.dropzoneConfig = {
                options:{
                    paramName:'files',
                    acceptedFiles:'application/pdf,.jpg,.png,.jpeg,.gif,.bmp,.ico',
                    url:'/api/supplier/upload-vendor',
                    autoProcessQueue:false,
                    parallelUploads:5000
                },
                eventHandlers:{
                    addedfile:function(file, dataUri){
                        if(acceptedFiles.indexOf(file.type) === -1){
                            // $rootScope.ShowErrorNotification('File is not allowed');
                            alert('File is not allowed');
                            vm.certificateFilesDropZone.removeFile(file);
                        } else if(file.size > 4194304){
                            // $rootScope.ShowErrorNotification('File size should not be greater than 4 MB.');
                            alert('File size should not be greater than 4 MB.');
                            vm.certificateFilesDropZone.removeFile(file);
                        }
                        //setting the $apply to refersh the file list in the html
                        $scope.$apply(function(){});
                    },
                    thumbnail:function(file,data){
                        console.log(data);
                        var obj = {
                            text:data,
                            msgTo:vm.toUser.id,
                            msgFrom:userId,
                            type:2
                        };
                        if (data) {
                            $rootScope.$broadcast('SEND_MESSAGE',{action:'send',data:obj});
                            vm.message = '';
                            // setTimeout(() => ChatService.scrollToBottom(), 200);
                        }
                    },
                    success:function(file, data){
                        if(file.status === 'success'){
                            file.data = data.Data;
                            if(file.isComapyInfo){
                                companyInfoFiles.push(file);
                            } else {
                                certificateFiles.push(file);
                            }
                        }
                    },
                    queuecomplete:function(){
                        var fileLength = certificateFiles.length + companyInfoFiles.length;
                        if(fileLength === vm.certificateFilesDropZone.files.length){
                            $rootScope.$broadcast('uploadCompleted');
                        } else{
                            $rootScope.$broadcast('uploadError');
                        }
                    }
                }
            };
            // }, 500);
            //set title to get rid of the ADA compliance
            setTimeout(function () {
                $('.uploader input').attr('title', 'upload files');
            }, 3000);
            $rootScope.$on('userChange',function(event, data){
                vm.toUser = data;
                console.log(12)
                //$scope.$apply();
            });
        }

        function checkIfEnterKeyWasPressed($event){
            var keyCode = $event.which || $event.keyCode;
            if (keyCode === 13) {
                sendMessage();
                // Do that thing you finally wanted to do
            }
        }

        $scope.$on('uploadError', function(){
            $rootScope.$broadcast('loader_hide');
            // $rootScope.ShowErrorNotification('There is an error in uploading the file. Please try again after some time.');
            alert('There is an error in uploading the file. Please try again after some time.');
            vm.certificateFilesDropZone.files = _.filter(vm.certificateFilesDropZone.files,function(file){return !file.isComapyInfo;});
        });

        $scope.$on('uploadCompleted', function(){
            var innerCertificateFiles = [];
            var innerCompanyInfoFiles = [];
            _.forEach(certificateFiles, function(file,index){
                var fileObj = {};
                fileObj.Name = file.name;
                fileObj.URL = file.data.url;
                fileObj.ContentType = file.type;
                fileObj.ExpirationDate = new Date(vm.expiryDateArray[index]).getTime();
                innerCertificateFiles.push(fileObj);
            });
            _.forEach(companyInfoFiles, function(file){
                var fileObj = {};
                fileObj.Name = file.name;
                fileObj.URL = file.data.url;
                fileObj.ContentType = file.type;
                innerCompanyInfoFiles.push(fileObj);
            });
            vm.certificateFilesDropZone.files = _.filter(vm.certificateFilesDropZone.files,function(file){return !file.isComapyInfo;});
            saveForeignVendor(innerCertificateFiles,innerCompanyInfoFiles);
        });

        function sendMessage(){

            var obj = {
                text:vm.message,
                msgTo:vm.toUser.id,
                msgFrom:parseInt(userId),
                type:1
            };

            if (vm.message) {
                $rootScope.$broadcast('SEND_MESSAGE',{action:'send',data:obj});
                vm.message = '';
                // setTimeout(() => ChatService.scrollToBottom(), 200);
            }
        }

        function uploadFile(){
            console.log('uploadFile')
        }
    }
})();