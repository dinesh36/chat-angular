'use strict';
(function(){
	angular.module('HTMediaManager')
		.controller('MediaManagerManageFolderController', Controller);
	Controller.$inject = ['$rootScope', '$scope', '$state', 'MediaManagerService', 'lodash', 'ngDialog'];
	function Controller($rootScope, $scope, $state, MediaManagerService, _, ngDialog){
		var vm=this;
		vm.folderName='';
		vm.saveFolder=saveFolder;
		vm.parentFolder=$scope.ngDialogData.parentFolder;
		var currentFolder=$scope.ngDialogData.currentFolder;

		activate();
		function activate(){
			if(currentFolder){
				vm.folderName = currentFolder.Name;
			}
		}

		function saveFolder(){
			if(!currentFolder){
				MediaManagerService.createDirectory({Name:vm.folderName, Parent:vm.parentFolder._id})
					.then(function(data){
						$scope.closeThisDialog();
					})
					.catch(function(error){
						$rootScope.ShowErrorNotification(error.Message);
					});
			}else{
				MediaManagerService.updateDirectory(currentFolder._id,{Name:vm.folderName})
					.then(function(data){
						currentFolder.Name=vm.folderName;
						$scope.closeThisDialog(currentFolder);
					})
					.catch(function(error){
						$rootScope.ShowErrorNotification(error.Message);
					});
			}
		}
	}
})();