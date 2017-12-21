'use strict';
(function(){
	angular
		.module('HTMediaManager')
		.controller('MediaManagerController', Controller);
	Controller.$inject = ['$rootScope', '$scope', 'MediaManagerService', 'lodash', 'ngDialog', '$timeout', '$window'];
	function Controller($rootScope, $scope, MediaManagerService, _, ngDialog, $timeout, $window) {
		var vm = this,
			rootDirectory = [],
			linkSelectionMode=false,
			tags = [],
			onlyVideo = false;
		vm.folders = [];
		vm.breadcrumbs = [];
		vm.tags = tags;
		vm.currentDirector = {};
		vm.files = [];
		vm.dropzoneConfig = {};
		vm.myDropzone = null;
		vm.searchQuery = '';
		vm.isSurfingMode = false;
		vm.isFromMenu = false;
		vm.selectDirectory = selectDirectory;
		vm.changeBreadcrumb = changeBreadcrumb;
		vm.deleteFolder = deleteFolder;
		vm.editFolder = editFolder;
		vm.addNewFolder = addNewFolder;
		vm.deleteFile = deleteFile;
		vm.addNewFile=addNewFile;
		vm.searchFile=searchFile;
		vm.editFile=editFile;
		vm.clearSearchBox = clearSearchBox;
		vm.searchFolder = searchFolder;
		vm.clearFolderSearchBox = clearFolderSearchBox;
		vm.moveFolder = moveFolder;
		vm.getFileByTagName = getFileByTagName;
		if ($scope.app) {
			$scope.app.title = 'Media'; //RED-556
		}
		activate();

		/**
		 * @method activate
		 * @description function to be called when controller is activate
		 */
		function activate() {
			$scope.app.activeMenu = 'media';

			MediaManagerService.getDirectories('0')
				.then(function (response) {
					rootDirectory = response;
					MediaManagerService.getTags()
						.then(function (innerResponse) {
							tags = innerResponse;
							vm.tags = tags;
							_activeAfterResolve();
						});
				});

			/**
			 * @method _activeAfterResolve
			 * @description function to be called after getting the tags
			 * @private
			 */
			function _activeAfterResolve() {
				//add click event listeners for the jqCloud directive
				$timeout(function () {
					angular.element('.jqcloud span').bind('click', function () {
						vm.getFileByTagName(angular.element(this).html());
					});
				}, 500);
				selectDirectory(rootDirectory[0]);
				if ($scope.ngDialogData) {
					if ($scope.ngDialogData.mode === 'surfing') {
						vm.isSurfingMode = true;
						vm.isFromMenu = $scope.ngDialogData.isFromMenu;
						linkSelectionMode = !!$scope.ngDialogData.linkSelectionMode;
						vm.onlyVideo = $scope.ngDialogData.onlyVideo;
					}
				}
			}
		}


		/**
		 * @method addNewFile
		 * @description function to add new file
		 */
		function addNewFile(){
			vm.dropzoneConfig = {};
			$timeout(function(){
				vm.dropzoneConfig = {
					options:{
						url:'/admin/mediamanager/folders/' + vm.currentDirector._id + '/files',
						autoProcessQueue:true
					},
					eventHandlers:{
						complete:function(file){
							vm.myDropzone.removeFile(file);
							getFiles(vm.currentDirector);
						}
					}
				};
			}, 500);
		}

		/**
		 * @method searchFile
		 * @description function to search file
		 */
		function searchFile(){
			if(vm.searchQuery !== ''){
				MediaManagerService.searchFiles(vm.searchQuery)
					.then(setFiles);
			}else{
				MediaManagerService.getFiles(vm.currentDirector._id)
					.then(setFiles);
			}
		}

		/**
		 * @method clearSearchBox
		 * @description function to clear search box
		 */
		function clearSearchBox(){
			vm.searchQuery = '';
			MediaManagerService.getFiles(vm.currentDirector._id)
				.then(setFiles);
		}

		/**
		 * @method getDirectories
		 * @description function to get directories
		 * @param directory
		 */
		function getDirectories(directory){
			MediaManagerService.getDirectories(directory._id)
				.then(function(directories){
					vm.folders = directories;
				});
		}

		/**
		 * @method getFiles
		 * @description function to get the files for directory
		 * @param directory
		 */
		function getFiles(directory){
			MediaManagerService.getFiles(directory._id)
				.then(setFiles);
		}

		/**
		 * @method selectDirectory
		 * @description function to select the directory and set the breadcrum when directory selected
		 * @param directory
		 */
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
			getFiles(directory);
			vm.dropzoneConfig = {};
		}

		/**
		 * @method changeBreadcrumb
		 * @description function to change the breadcrumb
		 * @param index
		 */
		function changeBreadcrumb(index){
			var folder = vm.breadcrumbs[index];
			vm.breadcrumbs.splice(index, vm.breadcrumbs.length - index);
			selectDirectory(folder);
		}

		/**
		 * @method deleteFolder
		 * @description function to delete folder
		 * @param directory
		 */
		function deleteFolder(directory){
			var answer = $window.confirm('Do you want to delete ' + directory.Name + ' folder?');
			if(answer === true) {
				MediaManagerService.deleteDirectory(directory._id)
					.then(function(){
						$rootScope.ShowSuccessNotification('Folder deleted successfully');
						_.remove(vm.folders, directory);
					})
					.catch(function(e){
						$rootScope.ShowErrorNotification(e.Message);
					});
			}
		}

		/**
		 * @method addNewFolder
		 * @description function to add new folder
		 */
		function addNewFolder(){
			ngDialog.open({
				template:'/admin/components/ht-media-manager/templates/addnew.html',
				controller:'MediaManagerManageFolderController',
				controllerAs:'vm',
				data:{parentFolder:vm.currentDirector}
			}).closePromise.then(function(){
				getDirectories(vm.currentDirector);
			});
		}

		/**
		 * @method editFolder
		 * @description function to edit folder name
		 * @param folder
		 */
		function editFolder(folder){
			ngDialog.open({
				template:'/admin/components/ht-media-manager/templates/addnew.html',
				controller:'MediaManagerManageFolderController',
				controllerAs:'vm',
				data:{parentFolder:vm.currentDirector, currentFolder:folder}
			}).closePromise.then(function(data){
				if (data._id) {
					folder.Name = data.Name;
				}
			});
		}

		/**
		 * @method deleteFile
		 * @description function to delete file
		 * @param fileId
		 */
		function deleteFile(fileId){
			var file = _.find(vm.files,{_id:fileId});
            var message = 'Do you want to delete file?';
            message = file.FileUsage && file.FileUsage.length?'This file has been used in other places. Do you want to delete file?':message;
			var answer = $window.confirm(message);
			if(answer === true) {
				MediaManagerService.deleteFile(vm.currentDirector._id, fileId)
					.then(function(){
						$rootScope.ShowSuccessNotification('File deleted successfully');
						getFiles(vm.currentDirector);
					});
			}
		}

		/**
		 * @method editFile
		 * @description function to edit file name
		 * @param file
		 * @ticket BOMB-290
		 */
		function editFile(file){
			if (vm.isSurfingMode && file.IsImage === false && !linkSelectionMode) {
				$scope.closeThisDialog({Url:file.Url,isImage:false,fileName:file.FileName});
			}else if(vm.isSurfingMode){
				ngDialog.open({
					template: '/admin/components/ht-media-manager/templates/filedetail.html',
					controller: 'MediaManagerManageFileController',
					controllerAs: 'vm',
					data: {
						currentFolder: vm.currentDirector,
						selectedFile: file,
						isSurfingMode: vm.isSurfingMode,
						isFromMenu: vm.isFromMenu,
						linkSelectionMode: linkSelectionMode
					}
				}).closePromise.then(function (data) {
					if (data.value.Url.indexOf('http') !== -1) {
						$scope.closeThisDialog(data.value);
					}
				});
			}else{
				ngDialog.open({
					template:'/admin/components/ht-media-manager/templates/filedetail.html',
					controller:'MediaManagerManageFileController',
					controllerAs:'vm',
					className:'ngdialog-theme-default big popup',
					data:{currentFolder:vm.currentDirector, selectedFile:file,isSurfingMode:false}
				});
			}

		}

		/**
		 * @method searchFolder
		 * @description function to search folder
		 * @param event
		 */
		function searchFolder(event) {
			if (event.keyCode === 13) {
				if (vm.searchFolderQuery === '') {
					vm.searchFolderQuery = '';
					MediaManagerService.getDirectories(vm.currentDirector._id)
						.then(function(directories){
							vm.folders = directories;
						});
				} else{
					MediaManagerService.searchFolders(vm.searchFolderQuery)
						.then(function(folders){
							vm.folders = folders;
						});
				}
			}
		}

		/**
		 * @method clearFolderSearchBox
		 * @description function to clear folder search box
		 */
		function clearFolderSearchBox(){
			vm.searchFolderQuery = '';
			MediaManagerService.getDirectories(vm.currentDirector._id)
				.then(function(directories){
					vm.folders = directories;
				});
		}

		/**
		 * @method moveFolder
		 * @description function to open move folder popup
		 * @param data
		 */
		function moveFolder (data) {
			ngDialog.open({
				template:'/admin/components/ht-media-manager/templates/organizeMedia.html',
				controller:'OrganizeMediaController',
				controllerAs:'vm',
				resolve: {
					moveData: function() {
						return data;
					},
					'rootDirectory': ['MediaManagerService', function (MediaManagerService) {
						return MediaManagerService.getDirectories('0');
					}]
				}
			}).closePromise.then(function(){
				selectDirectory(rootDirectory[0]);
			});
		}


		/**
		 * @method setFiles
		 * @description function to set the files response to the controller array
		 * @param files
		 */
		function setFiles(files){
			if (linkSelectionMode) { //if the media selector is opened from the menu then only show the images
				vm.files = _.filter(files, {IsImage: false});
				} else if (vm.isFromMenu) {
				vm.files= _.filter(files,{IsImage:true});
			} else if(vm.onlyVideo) {
				vm.files = _.filter(files,function(data){
					return data.MimeType === 'video/mp4' && !data.IsImage;
				});
				}else{
				vm.files = files;
			}
		}

		/**
		 * @method getFileByTagName
		 * @description function to search the file by tag name
		 * @param tagName
		 */
		function getFileByTagName(tagName){
			MediaManagerService.getFileByTagName(tagName)
				.then(function(files){
					setFiles(files);
				});
		}
	}
})();