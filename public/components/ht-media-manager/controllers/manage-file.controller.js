'use strict';
(function(){
	try {
		angular.module('HTMediaManager');
	}catch(e){
		angular.module('HTMediaManager',[]);
	}
	angular.module('HTMediaManager')
		.constant('FILE_USAGE_MODELS', {
			'Jobs': {link:'app/career/editarea/{{id}}',displayName:'Career Jobs'},
			'CareerStories': {link: 'app/career/editStories/{{id}}',displayName:'Career Stories'},
			'Advertise': {link: 'app/advertisement/{{id}}/edit-advertise',displayName:'Advertise'},
			'Banner': {link: 'app/home-page-management/{{id}}/edit-banner',displayName:'Home Page Banner'},
			'Hotbox': {link: 'app/home-page-management/{{id}}/edit-homepage-tile',displayName:'Home Page Tiles'},
			'Recipe': {link: 'app/recipe/edit/{{id}}',displayName:'Recipe'},
			'OurVendorBanner': {link: 'app/our-vendor/{{id}}/edit',displayName:'Our Vendor Banner'},
			'FooterSettings': {link: 'app/settings/footer-settings',displayName:'Footer Promo Image'},
			'FFOBanner':{link: 'app/settings/template-settings',displayName:'FFO Banner'},
			'GiftBanner':{link:'app/settings/template-settings',displayName:'Gift Subscription Banner'},
			'GiftSignUpBanner':{link:'app/settings/template-settings',displayName:'Gift Subscription Sign Up Banner'},
			'FloralBanner':{link:'app/settings/template-settings',displayName:'Floral Landing Page Banner'},
			'Menu':{link:'app/menus/{{id}}/edit',displayName:'Menu'},
			'Page-Draft':{link:'app/pages/{{id}}/edit',displayName:'Page (Draft)'},
			'Page-Body':{link:'app/pages/{{id}}/edit',displayName:'Page (Body)'},
			'RecipeTag': {link: 'app/recipe/manageTag',displayName:'RecipeTag'}, //BOMB-2943
			'TIESupply':{link:'app/tie/edit-supply/{{id}}',displayName:'TIESupply'}
		})
		.controller('MediaManagerManageFileController', Controller);
	Controller.$inject = ['$rootScope', '$scope', '$state', 'MediaManagerService', 'PageService', 'lodash', 'MenuService','FILE_USAGE_MODELS','$timeout'];
	function Controller($rootScope, $scope, $state, MediaManagerService, PageService, _, MenuService,FILE_USAGE_MODELS,$timeout){
		var vm = this;
		vm.resolution = [];
		vm.otherResolution = [];
		vm.imageTags = [];
		vm.imgHeight = '';
		vm.imgWidth = '';
		vm.isSurfingMode = false;
		vm.isFromMenu = false;
		vm.filePath = '';
		vm.fileUsedPages = {};
		vm.showFileUse = false;
		vm.fileUsedMenus = {};
		vm.showMenuUse = false;
		vm.isNewTab = false;
		var selectedFile = $scope.ngDialogData.selectedFile;
		var currentFolder = $scope.ngDialogData.currentFolder;
		vm.selectedFile = selectedFile;
		vm.fileUsageModels = angular.copy(FILE_USAGE_MODELS);
		vm.selectedFile.FileUsage = 'loading';
		vm.fileInfo={};
		vm.updateFile = updateFile;
		vm.searchTag = searchTag;
		vm.insertImage = insertImage;
		vm.goToPage = goToPage;
		vm.downloadFile = downloadFile;
		vm.copyToClipboard = copyToClipboard;
		activate();

		/**
		 * @method activate
		 * @description function to be called when controller is active
		 */
		function activate(){
			if(selectedFile){
				getFile(); //Get file information
				getUsedFilePages(); // Get pages in which this file is used
				getUsedFileMenus();
				vm.fileInfo={
					fileName:selectedFile.FileName,
					Url:selectedFile.Url,
					fileDescription:selectedFile.Description,
					imageTags:selectedFile.Tags || [],
					fileSize: bytesToSize(selectedFile.Size)
				};
				if(selectedFile.MimeType.indexOf('image/') === 0){
					vm.fileInfo.isImage = true;
				}


				if(vm.fileInfo.isImage === true){
					vm.otherResolution = selectedFile.OtherResolution;
					for(var k in vm.otherResolution){
						vm.otherResolution[k].isImage=true;
						vm.otherResolution[k].fileName=selectedFile.FileName;
					}
					if(selectedFile.Resolution.length>0){
						vm.imgHeight = selectedFile.Resolution[0]['height'];
						vm.imgWidth = selectedFile.Resolution[0]['width'];
						vm.resolution = vm.imgHeight + 'x' + vm.imgWidth;
						vm.fileInfo.Resolution=vm.resolution;
					}
				}
			}
			if($scope.ngDialogData){
				vm.isSurfingMode = $scope.ngDialogData.isSurfingMode;
				vm.isFromMenu = $scope.ngDialogData.isFromMenu;
				vm.linkSelectionMode = $scope.ngDialogData.linkSelectionMode;
			}
		}

		/**
		 * @method updateFile
		 * @description function to upload file
		 */
		function updateFile(){
			var tags = [];
			_.each(vm.fileInfo.imageTags, function (value) {
				tags.push(_.omit(value,['weight','_id']));
			});
			MediaManagerService.updateFile(currentFolder._id, selectedFile._id, {
				Tags: tags,
				FileName: vm.fileInfo.fileName,
				Description: vm.fileInfo.fileDescription
			})
				.then(function(data){
					selectedFile.FileName = data.FileName;
					selectedFile.Description = data.Description;
					$scope.closeThisDialog(selectedFile);
				})
				.catch(function(error){
					$rootScope.ShowErrorNotification(error.Message);
				});
		}

		/**
		 * @method bytesToSize
		 * @description function to convert the bytes to size
		 * @param bytes
		 * @returns {*}
		 */
		function bytesToSize(bytes){
			var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
			if(bytes === 0){ return '0 Byte';}
			var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
			return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
		}

		/**
		 * @method insertImage
		 * @description function to insert the image
		 * @param file
		 */
		function insertImage(file){
			//set the thumb image and id if selected file is image
			file.isNewTab = vm.isNewTab;
			if(vm.fileInfo.isImage === true) {
				file.fileId = selectedFile._id;
				file.thumbUrl = selectedFile.Url;
				if(selectedFile.OtherResolution.length){
					file.thumbUrl = _.find(selectedFile.OtherResolution,{'Resolution':'150x150'}).Url || file.thumbUrl;
				}
			}
			$scope.closeThisDialog(file);
		}

		/**
		 * @method getFile
		 * @description function to get file
		 * @tickets: BOMB-235
		 */
		function getFile(){
			MediaManagerService.getFile(currentFolder._id, selectedFile._id)
				.then(function(file){
					vm.filePath = file.path;
					vm.selectedFile = file;
					vm.selectedFile.FileUsage = (!vm.selectedFile.FileUsage || !vm.selectedFile.FileUsage.length)?null:vm.selectedFile.FileUsage;
					if(vm.selectedFile.FileUsage){
						_.forEach(vm.selectedFile.FileUsage,function(fileUsage){
							fileUsage.link = window.location.origin+'/admin/#/'+vm.fileUsageModels[fileUsage.Model].link.replace('{{id}}',fileUsage.Id);
							fileUsage.displayModel = vm.fileUsageModels[fileUsage.Model].displayName;
						});
					}
				})
				.catch(function () {
					vm.filePath = '';
				});
		}

		/**
		 * @method getUsedFilePages
		 * @description function to get used file pages
		 */
		function getUsedFilePages(){
			var urlArray = [];
			PageService.PageList({}).then(function(pagesData){
				//Get urls of file in an array which later use for check in page body contents
				if(selectedFile.Url){
					urlArray.push(selectedFile.Url);
				}
				if(selectedFile.OtherResolution !== ''){
					selectedFile.OtherResolution.forEach(function(resolution){
						if(resolution.Url !== ''){
							urlArray.push(resolution.Url);
						}
					});
				}
				//Check url used in any page or not and return page information array
				pagesData.data.forEach(function(pageInfo){
					if(urlArray !== ''){
						urlArray.forEach(function(link){
							var pattern = new RegExp(link);
							if(pattern.test(pageInfo.Body)){
								vm.showFileUse = true;
								if(vm.fileUsedPages[pageInfo._id] === undefined) {
									vm.fileUsedPages[pageInfo._id] = {Id: pageInfo._id, Name: pageInfo.PageName};
								}
							}
						});
					}
				});
			});
		}

		/**
		 * @method getUsedFilePages
		 * @description method to find the menu list where file is used
		 */
		function getUsedFileMenus(){
			var urlArray = [];
			MenuService.menuList({}).then(function(menuData){
				//Get urls of file in an array which later use for check in page body contents
				if(selectedFile.Url){
					urlArray.push(selectedFile.Url);
				}
				if(selectedFile.OtherResolution !==''){
					selectedFile.OtherResolution.forEach(function(resolution){
						if(resolution.Url !== ''){
							urlArray.push(resolution.Url);
						}
					});
				}
				//Check url used in any page or not and return page information array
				menuData.data.forEach(function(menuInfo){
					if(urlArray !== ''){
						urlArray.forEach(function(link){
							var pattern = new RegExp(link);
							if(pattern.test(JSON.stringify(menuInfo))){
								vm.showMenuUse = true;
								if(vm.fileUsedMenus[menuInfo._id] === undefined) {
									vm.fileUsedMenus[menuInfo._id] = {Id: menuInfo._id, Name: menuInfo.MenuName};
								}
							}
						});
					}
				});
			});
		}

		/**
		 * @method goToPage
		 * @description function to go to the page
		 * @param pageId
		 */
		function goToPage(pageId){
			$scope.closeThisDialog(selectedFile);
			$state.go('app.pages.edit', {id:pageId});
		}

		/**
		 * @method searchTag
		 * @description function to search tag
		 * @param query
		 * @returns {*}
		 */
		function searchTag(query){
			return MediaManagerService.getTags(query);
		}

		/**
		 * @method downloadFile
		 * @description function to download the file
		 * @param file
		 */
		function downloadFile(file) {
			var fileURL = file.Url;
			var xhr = new XMLHttpRequest();
			xhr.open('GET', fileURL, true);
			xhr.setRequestHeader('Content-Disposition', 'filename="' + fileURL + '"');
			xhr.send();
		}

		/**
		 * @method copyToClipboard
		 * @description function to copy to clipboard
		 * @param elemId
		 * @returns {*}
		 * @tickets: BOMB-1923
		 */
		function copyToClipboard(elemId){
			var link = vm.fileInfo.Url;
			copyToClipBoard(elemId,link);
		}

		//FIXME change this logic to comman services, this is not working now, as there is an error in injecting the comman service in the case of content editor
		/**
		 * @method copyToClipBoard
		 * @description function to copy to clip board
		 * @param elemId
		 * @param text
		 * @tickets BOMB-2106,BOMB-1923
		 */
		function copyToClipBoard(elemId,text){
			var elem = jQuery(elemId)[0];
			// create hidden text element, if it doesn't already exist
			var targetId = '_hiddenCopyText_';
			var isInput = false;//elem.tagName === 'INPUT' || elem.tagName === 'TEXTAREA';
			var origSelectionStart, origSelectionEnd;
			var target;
			if (isInput) {
				// can just use the original source element for the selection and copy
				target = elem;
				origSelectionStart = elem.selectionStart;
				origSelectionEnd = elem.selectionEnd;
			} else {
				// must use a temporary form element for the selection and copy
				target = window.document.getElementById(targetId);
				if (!target) {
					target = window.document.createElement('textarea');
					target.style.position = 'absolute';
					target.style.left = '-9999px';
					target.style.top = '0';
					target.id = targetId;
					window.document.body.appendChild(target);
				}
				//target.textContent = elem.textContent;
				target.textContent = text;
			}
			// select the content
			var currentFocus = window.document.activeElement;
			target.focus();
			target.setSelectionRange(0, target.value.length);

			// copy the selection
			var succeed;
			try {
				succeed = window.document.execCommand('copy');
			} catch(e) {
				succeed = false;
			}
			// restore original focus
			if (currentFocus && typeof currentFocus.focus === 'function') {
				currentFocus.focus();
			}

			if (isInput) {
				// restore prior selection
				elem.setSelectionRange(origSelectionStart, origSelectionEnd);
			} else {
				// clear temporary content
				target.textContent = '';
			}
			return succeed;
		}
	}
})();