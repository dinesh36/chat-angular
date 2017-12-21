'use strict';
(function(){
	angular
		.module('HTAdminApp')
		.controller('NewUserController', Controller);
	Controller.$inject = ['$rootScope', '$scope', '$state', 'UserService', 'roleList', 'SettingsService', 'lodash'];
	function Controller($rootScope, $scope, $state, UserService, roleList, SettingsService, _){
		var vm = this;
		//var defaultPageSize = 15;
		vm.isEdit = false;
		vm.isError = false;
		vm.isInfo = false;
		vm.infoMessage = null;
		vm.errorMessage = null;
		vm.roleList = [];
		vm.BackToList = BackToList;
		vm.SaveUser = SaveUser;
		vm.ToggleRelatedPermission = ToggleRelatedPermission;
		Activate();
		/**
		 * @method Activate
		 * @description set the data on page inistialize
		 * @ticket BOMB-1480 (updated)
		 */
		function Activate(){
			$scope.app.pageHeader = 'Add User';
			$scope.app.pageSubHeader = 'Add/Edit User';
			$scope.app.activeMenu = 'users';
			vm.roleList = roleList;
			vm.permissions = [
				{label:'View'},
				{label:'Add / Edit'},
				{label:'Edit'},
				{label:'Delete'},
				{label:'Publish'},
				{label:'All'}
			];
			SettingsService.getPageCategoryList({rows:50, pageNo:1, sortBy:'LastModifyOn', sortOrder:-1})
				.then(function(data){
					vm.pageCategoies = data.data;
					vm.pageCategoies.forEach(function(val){
						val.applicablePermissions = ['View', 'Add','Edit', 'Delete', 'Publish','All'];
					});
				},function(err){
					vm.isError = true;
					vm.errorMessage = err.Message;
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
							if(permissionToken === 'View'  || permissionToken === 'Add' || permissionToken === 'Edit'){
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
						vm.modulePermission[id][permissionToken] = flag;
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
		 * @method getPostData
		 * @description get the post data for api
		 * @ticket BOMB-1480 (updated)
		 */
		function getPostData () {
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
			return {
				'FirstName':vm.firstName,
				'LastName':vm.lastName,
				'Email':vm.email.toLowerCase(),
				'Roles':userRoles,
				'PageCategoryPermission': postCategoryArray
			};
		}

		/**
		 * @method SaveUser
		 * @description save the user
		 * @param formName
		 * @param saveAndAdd
		 * @ticket BOMB-1480 (updated)
		 */
		function SaveUser(formName, saveAndAdd){
			vm.isError = false;
			vm.isInfo = false;
			var postObj = getPostData();
			if(formName.$valid){
				UserService.AddUser(postObj)
					.then(function(){
						if(saveAndAdd === true){
							vm.isInfo = true;
							vm.infoMessage = 'The user has been added successfully.';
							resetFormFields(formName);
						} else{
							$rootScope.isSuccess = true;
							$rootScope.successMessage = 'User added successfully.';
							$state.go('app.users.list');
						}
					}, function(err){
						if(err){
							vm.isError = true;
							vm.errorMessage = err.Message;
						}
					});
			}
		}

		/**
		 * @method BackToList
		 * @description back to listing page
		 */
		function BackToList(){
			$state.go('app.users.list');
		}

		/**
		 * @method resetFormFields
		 * @description reset the form data
		 * @param formName
		 * @ticket BOMB-1480 (updated)
		 */
		function resetFormFields(formName){
			formName.$submitted = false;
			vm.firstName = null;
			formName.firstName.$touched = false;
			vm.lastName = null;
			formName.lastName.$touched = false;
			vm.email = null;
			formName.email.$touched = false;
			vm.roles = null;
			formName.roles.$touched = false;
			vm.modulePermission = {};
		}
	}
})();

/*
pageCategoryId: {type: String},
View: {type: Boolean},
Add: {type: Boolean},
Edit: {type:Boolean},
Delete: {type: Boolean},
Publish: {type:Boolean}*/
