'use strict';
(function () {
	angular
		.module('HTMediaManager')
		.controller('OrganizeMediaController', OrganizeMediaController);

	OrganizeMediaController.$inject = ['moveData', 'rootDirectory', 'MediaManagerService', 'ngDialog', '$scope', '$rootScope', 'lodash'];
	function OrganizeMediaController (moveData, rootDirectory, MediaManagerService, ngDialog, $scope, $rootScope, _) {
		var vm = this;

		//variable declaration		
		vm.breadcrumbs = [];
		//function declaration
		vm.selectDirectory = selectDirectory;
		vm.changeBreadcrumb = changeBreadcrumb;
		vm.MoveFolderHere = MoveFolderHere;
		vm.cancel = cancel;
		vm.addNewFolder = addNewFolder;
		
		activate();

		function activate () {
			selectDirectory(rootDirectory[0]);
			getFiles(rootDirectory[0]);
		}

		function selectDirectory(directory){
			vm.breadcrumbs = [];
			MediaManagerService.getDirectoryParents(directory._id)
				.then(function(dirData){
					dirData.forEach(function(dir){
						vm.breadcrumbs.push(dir);
					});
				});
			vm.currentDirector = directory;
			getDirectories(directory);
			vm.dropzoneConfig = {};
		}

		function getDirectories(directory){
			MediaManagerService.getDirectories(directory._id)
				.then(function(directories){
					vm.folders = directories;
				});
			getFiles(directory);
		}

		function getFiles(directory){
			MediaManagerService.getFiles(directory._id)
				.then(function(files){
					vm.currentDirectoryFiles = files;
				});
		}	

		function changeBreadcrumb(index){
			var folder = vm.breadcrumbs[index];
			vm.breadcrumbs.splice(index, vm.breadcrumbs.length - index);
			selectDirectory(folder);
		}

		function cancel () {
			$scope.closeThisDialog();
		}

		function MoveFolderHere () {
			getDirectories(vm.currentDirector);
			CheckFileOrFolder();
		}

		function CheckFileOrFolder () {			
			if (moveData.Name) { 
				if ( vm.folders.length != 0 ) {
					IsExist(vm.folders, "folders");
				} else {
					IsSubFolder();
				}
			} else { 
				if ( vm.currentDirectoryFiles.length == 0 ) {
					MoveFile("files");
				} else {
					IsExist(vm.currentDirectoryFiles, "files");
				}				
			}
		}

		function IsExist (currentData, type) {
			var isExist = false;
			currentData.forEach(function(data){
				if ( data._id == moveData._id && isExist == false ) {
					isExist = true;
					if ( type == "files" ) {
						alert("File is already exist");
					} else {
						alert("Please select the folder");
					}
				}
			});
			if ( isExist == false ) {
				if (type == "files" ) {
					MoveFile("files");
				} else {
					IsSubFolder();	
				}
			}

		}

		function IsSubFolder () {
			var canMove = true;
			vm.breadcrumbs.forEach(function(breadcrumb){
				if (breadcrumb._id == moveData._id) {
					canMove = false;
					alert("Cannot move the parent to its subfolder");
				}
			});
			if (canMove == true) {
				MoveFile("folders");
			}
		}

		function MoveFile (type) {
			var lastElement = _.last(vm.breadcrumbs);
			if (type == "files") {				
				MediaManagerService.moveFile(lastElement._id, moveData._id)
					.then(function(files){
						alert("file moved successfully");				
						$scope.closeThisDialog(vm.folders);
					});	
			} else {
				MediaManagerService.moveFolder(moveData._id, lastElement._id)
					.then(function(folder){
						alert("folder moved successfully");				
						$scope.closeThisDialog(vm.folders);
					});
			}
			
		}

		function addNewFolder () {
			ngDialog.open({
				template:'/admin/app/modules/mediamanager/templates/addnew.html',
				controller:'MediaManagerManageFolderController',
				controllerAs:'vm',
				data:{parentFolder:vm.currentDirector}
			}).closePromise.then(function(data){
				getDirectories(vm.currentDirector);
			});
		}
	}
})();