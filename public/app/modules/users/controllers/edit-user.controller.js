'use strict';
(function(){
	angular
		.module('HTAdminApp')
		.controller('EditUserController', Controller);

	Controller.$inject=['$rootScope','$scope','$state','UserService','roleList','userDetails','lodash', 'SettingsService', 'PageCategory'];
	function Controller($rootScope,$scope,$state,UserService,roleList,userDetails,_,SettingsService, PageCategory){
		var vm = this;
		vm.isEdit = true;
		vm.isError = false;
		vm.isInfo = false;
		vm.infoMessage = null;
		vm.errorMessage = null;
		vm.roleList = [];
		vm.modulePermission = {};
		vm.permissions = [
			{label:'View', key:'view', sortOrder:1},
			{label:'Add / Edit', key:'add', sortOrder:2},
			{label:'Edit', key:'edit', sortOrder:3},
			{label:'Delete', key:'delete', sortOrder:4},
			{label:'Publish', key:'publish', sortOrder:5},
			{label:'All', key:'all', sortOrder:6}
		];
		vm.SaveUser = SaveUser;
		vm.unlockUser = unlockUser;
		vm.ToggleRelatedPermission = ToggleRelatedPermission;
		Activate();

		/**
		 * @method Activate
		 * @description set the data on page inistialize
		 * @ticket BOMB-1480,BOMB-590
		 */
		function Activate() {
			$scope.app.pageHeader='Edit User';
			$scope.app.pageSubHeader='Add/Edit User';
			$scope.app.activeMenu='users';
			vm.roleList = roleList;
			if(userDetails.user._id) {
				vm.firstName = userDetails.user.FirstName;
				vm.lastName = userDetails.user.LastName;
				vm.email = userDetails.user.Email;
				vm.lockStatus = userDetails.user.IsLocked?'Locked':'Unlocked';
				_.forEach(vm.roleList, function(n, key) {
				  	if(n._id === userDetails.user.Roles[0]) {
				  		vm.roles = n;
				  	}
				});
			} else {
				$rootScope.isError = true;
				$rootScope.errorMessage = 'User not found';
				$state.go('app.users.list');
				return;
			}
			vm.pageCategoies = PageCategory.data;
			vm.pageCategoies.forEach(function(val){
				val.applicablePermissions = ['View', 'Add','Edit', 'Delete', 'Publish','All'];
			});

			if (userDetails.user.PageCategoryPermission) {
				userDetails.user.PageCategoryPermission.forEach(function(per){
					if(!vm.modulePermission[per.PageCategoryId]){
						vm.modulePermission[per.PageCategoryId] = {};
					}
					if (per.Permissions.View) {
						vm.modulePermission[per.PageCategoryId]['View'] = true;
					}
					if (per.Permissions.Add) {
						vm.modulePermission[per.PageCategoryId]['Add'] = true;
					}
					if (per.Permissions.Edit) {
						vm.modulePermission[per.PageCategoryId]['Edit'] = true;
					}
					if (per.Permissions.Delete) {
						vm.modulePermission[per.PageCategoryId]['Delete'] = true;
					}
					if (per.Permissions.Publish) {
						vm.modulePermission[per.PageCategoryId]['Publish'] = true;
					}
					if (per.Permissions.All) {
						vm.modulePermission[per.PageCategoryId]['All'] = true;
					}
				});
			}
		}

		/**
		 * @method unlockUser
		 * @description function to unlock the user
		 * @tickets BOMB-590
		 */
		function unlockUser(){
			if(vm.lockLoading){
				return;
			}
			vm.lockLoading = true;
			UserService.unLockUser(userDetails.user._id)
				.then(function(){
					vm.lockStatus = 'Unlocked';
					vm.lockLoading = false;
					$rootScope.ShowSuccessNotification('User unlocked successfully.');
				})
				.catch(function(){
					vm.lockLoading = false;
					$rootScope.ShowErrorNotification('Error in unlocking the user.');
				});
		}

		/**
		 * @method ToggleRelatedPermission
		 * @description check and uncheck the related permission
		 * @param id
		 * @param key
		 * @ticket BOMB-1480
		 */
		function ToggleRelatedPermission (id, key) {
			if(vm.modulePermission[id][key]){
				CheckUncheckPermissions(id, key, true);
			} else{
				CheckUncheckPermissions(id, key, false);
			}
		}

		/**
		 * @method CheckUncheckPermissions
		 * @description check and uncheck the related permission
		 * @param id
		 * @param key
		 * @param flag
		 * @ticket BOMB-1480
		 */
		function CheckUncheckPermissions (id, key, flag){
			var selectedModule = _.find(vm.pageCategoies, function(moduleData){
				return moduleData._id === id;
			});
			if(key==='Add'){
				//set the edit permission as per add permission
				_.find(selectedModule.applicablePermissions, function(permissionToken){
					if(permissionToken === 'Edit'){
						vm.modulePermission[id][permissionToken] = flag;
					}
				});
			}
			if (flag) {
				switch(key){
					case 'View':
					case 'Add':
					case 'Edit':
					case 'Delete':
					case 'Publish':
						//update token value
						_.find(selectedModule.applicablePermissions, function(permissionToken){
							if(permissionToken === 'View' || permissionToken === 'Add' || permissionToken === 'Edit'){
								vm.modulePermission[id][permissionToken] = flag;
							}
						});
						break;
					case 'All':
						_.find(selectedModule.applicablePermissions, function(permissionToken){
							vm.modulePermission[id][permissionToken] = flag;
						});
						break;
				}
				VerifyToCheckFullPermission(id, selectedModule);
			} else {
				vm.modulePermission[id]['All'] = false;
				if(key === 'View' || key === 'All'){
					angular.forEach(selectedModule.applicablePermissions, function(permissionToken){
						delete vm.modulePermission[id];
					});
				}
			}
		}

		/**
		 * @method VerifyToCheckFullPermission
		 * @description check and uncheck for full permission
		 * @param id
		 * @param moduleObj
		 * @ticket redmine-616
		 */
		function VerifyToCheckFullPermission (id, moduleObj) {
			angular.forEach(moduleObj.applicablePermissions, function(permissionToken){
				if(vm.modulePermission[id]['View'] && vm.modulePermission[id]['Edit'] && vm.modulePermission[id]['Delete'] && vm.modulePermission[id]['Add'] && vm.modulePermission[id]['Publish']){
					vm.modulePermission[id]['All'] = true;
				}
			});
		}

		/**
		 * @method SaveUser
		 * @description save the user
		 * @param formName
		 * @ticket BOMB-1480 (updated)
		 */
		function SaveUser(formName) {
			vm.isError = false;
			vm.isInfo = false;
			var userRoles = [];
		  	userRoles.push(vm.roles._id);
			var postCategoryArray = [];
			if (vm.modulePermission) {
				var getProperty = Object.getOwnPropertyNames(vm.modulePermission);
				getProperty.forEach(function(val){
					var module = {};
					module.PageCategoryId = val;
					if (!module.Permissions) {
						module.Permissions = {};
					}
					if (vm.modulePermission[val].View) {
						module.Permissions = vm.modulePermission[val];
					} else {
						module.Permissions['View'] = false;
					}
					if (vm.modulePermission[val].Add){
						module.Permissions = vm.modulePermission[val];
					} else {
						module.Permissions['Add'] = false;
					}
					if (vm.modulePermission[val].Edit){
						module.Permissions = vm.modulePermission[val];
					} else {
						module.Permissions['Edit'] = false;
					}
					if (vm.modulePermission[val].Delete){
						module.Permissions = vm.modulePermission[val];
					} else {
						module.Permissions['Delete'] = false;
					}
					if (vm.modulePermission[val].Publish){
						module.Permissions = vm.modulePermission[val];
					} else {
						module.Permissions['Publish'] = false;
					}
					if (vm.modulePermission[val].All){
						module.Permissions = vm.modulePermission[val];
					} else {
						module.Permissions['All'] = false;
					}
					postCategoryArray.push(module);
				});
			}
			var postObj = {
				'FirstName': vm.firstName,
				'LastName': vm.lastName,
				'Email': vm.email.toLowerCase(),
				'Roles': userRoles,
				'PageCategories': postCategoryArray
			};
			if(formName.$valid) {
				UserService.EditUser(userDetails.user._id, postObj)
				.then(function(data){
					$rootScope.isSuccess = true;
					$rootScope.successMessage = 'User saved successfully.';
					$state.go('app.users.list');
				}, function(err){
					if(err){
						vm.isError = true;
						vm.errorMessage = err.Message;
					}
				});
			}
		}
	}

})();