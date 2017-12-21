'use strict';
(function(){
	angular
		.module('HTAdminApp')
		.controller('UsersListController', Controller);

	Controller.$inject=['$rootScope','$scope','$state','UserService','userList','userProfile','lodash','$filter','UserAuthorizationService','roleList'];
	function Controller($rootScope,$scope,$state,UserService,userList,userProfile,_,$filter,UserAuthorizationService,roleList){
		var vm = this;
		$scope.app.title = 'Users';
		var defaultPageSize = 50;
		vm.pageQuery = null;
		vm.isError = $rootScope.isError;
		vm.isInfo = $rootScope.isSuccess;
		vm.infoMessage = $rootScope.successMessage;
		vm.errorMessage = $rootScope.errorMessage;
		vm.gridOptions = {
			'columnDefs':[],
			'rowData':null,
			'GetRows':GetRows,
			'totalRows':0,
			'pageSize':defaultPageSize,
			'rowHeight':35,
			'headerHeight':40,
			'pageSizes':[25,50,100,250,500,750,1000],
			'enableColResize': true,
			'pinnedColumnCount':1,
			'enablePagging':true,
			'suppressMultiSort':true,
			'enableServerSideSorting':true,
			'enableServerSideFilter': true
		};
		vm.gridActions = [];
		vm.DeleteUser = DeleteUser;
		vm.ResetPassword = ResetPassword;
		Activate();

		function Activate() {
			$scope.app.pageHeader='Users';
			$scope.app.pageSubHeader='List of system users';
			$scope.app.activeMenu='users';
			// set column defination
			vm.gridOptions.columnDefs = [
				{
					field:'FirstName',
					headerName:'First Name',
					width:150,
					suppressSorting:false, // for sorting
					suppressMenu:false,
					suppressSizeToFit:true,
					filter:true
				},
				{
					field:'LastName',
					headerName:'Last Name',
					width:150,
					suppressSorting:false, // for sorting
					suppressMenu:false,
					suppressSizeToFit:true,
					filter:true
				},
				{
					field:'Email',
					headerName:'Email',
					width:270,
					suppressSorting:false, // for sorting
					suppressMenu:false,
					suppressSizeToFit:false,
					filter:true
				},
				{
					field:'Roles',
					headerName:'Role',
					width:180,
					cellRenderer: function(params) {
						var roles = '';
						if(params.data.Roles && params.data.Roles.length > 0)
							roles = params.data.Roles.join(',');
						return roles;
					},
					suppressSorting:false, // for sorting
					suppressMenu:false,
					suppressSizeToFit:false,
					filter:true
				},
				{
					field:'LastLogin',
					headerName:'Last Login',
					width:200,
					cellRenderer: function(params) {
						var formatedDate = $filter('date')(params.data.LastLogin, 'MM/dd/yyyy hh:mm a');
						return formatedDate;
					},
					suppressSorting:false, // for sorting
					suppressMenu:false,
					suppressSizeToFit:false,
					filter:true,
					filterType:'date',  // for date filtering
					filterParams: {
						cellRenderer: function (params) {
							var formatedDate = $filter('date')(params.value, 'MM/dd/yyyy hh:mm a');
							return formatedDate;
						}
					}
				}
								
			];

			if(UserAuthorizationService.CheckAuthorized('USER_CANEDIT')){
				vm.gridOptions.columnDefs.push({
					field:'',
					headerName:'',
					cellRenderer:function(){
						var resetPasswordLink = "<a class='pwdIcon actionIcon' title='Reset password'><i class='fa fa-key'></i></a>";
						return resetPasswordLink;
					},
					width:40,
					cellClicked:ResetPassword,
					suppressSorting:true, // for sorting
					suppressMenu:true,
					suppressSizeToFit:true,
					filter:false
				});
			}
				
			if(UserAuthorizationService.CheckAuthorized('USER_CANEDIT')){
				vm.gridOptions.columnDefs.push({
					field:'',
					headerName:'',
					cellRenderer:function(){
						var editUserLink = "<a class='editIcon actionIcon' title='Click to edit User'><i class='fa fa-pencil'></i></a>";
						return editUserLink;
					},
					width:40,
					cellClicked:MoveToEditScreen,
					suppressSorting:true, // for sorting
					suppressMenu:true,
					suppressSizeToFit:true,
					filter:false
				});
			}
				
			if(UserAuthorizationService.CheckAuthorized('USER_CANDELETE')){
				vm.gridOptions.columnDefs.push({
					field:'',
					headerName:'',
					cellRenderer:function(){
						var removeUserLink = "<a class='trashIcon actionIcon' title='Delete User'><i class='fa fa-trash'></i></a>";
						return removeUserLink;
					},
					width:40,
					cellClicked:DeleteUser,
					suppressSorting:true, // for sorting
					suppressMenu:true,
					suppressSizeToFit:true,
					filter:false
				});
			}

			vm.gridOptions.rowData = userList.data;
			vm.gridOptions.totalRows = userList.totalRows;
		}

		/**
		 * @method MoveToEditScreen
		 * @description Move to edit screen
		 * @param user
		 * @constructor
		 */
		function MoveToEditScreen(user) {
			$rootScope.isError = false;
			$rootScope.isSuccess = false;
			$state.go('app.users.edit',{id: user.data._id});
		}

		/**
		 * @method GetRows
 		 * @description Get rows
		 * @param query
		 * @returns {*}
		 * @constructor
		 */
		function GetRows(query){
			vm.pageQuery = query;
			vm.roleIdList =[];
			if(query.Roles){
				query.Roles = getRoleId(query.Roles);
			}
			if(query.LastLogin)
			{
				query.StartDate = moment(query.LastLogin.startDate).format('x');
				query.EndDate = moment(query.LastLogin.endDate).format('x');
			}
			return UserService.UserList(query);
		}

		/**
		 * @method getRoleId
		 * @description get RoleId
		 * @param roleName
		 * @returns {Array}
		 */
		function getRoleId(roleName){
			roleName = roleName.toUpperCase();
			roleList.data.forEach(function getId(role){
				if (role.RoleName) {
					if (role.RoleName.toUpperCase().indexOf(roleName) !== -1) {
						vm.roleIdList.push(role.id);
					}
				}
			});
			if(vm.roleIdList.length===0){
				vm.roleIdList.push(0);
			}
			return vm.roleIdList;
		}

		/**
		 * @method DeleteUser
		 * @description Delete user
		 * @param user
		 * @constructor
		 */

		function DeleteUser(user) {
			if(user.data._id === userProfile.id) {
				window.alert('You can\'t delete your account.');
			} else {
				var answer = window.confirm('Do you want to delete ' + user.data.Email + ' user?');
				if(answer === true) {
					UserService.DeleteUser(user.data._id).then(function(){
						vm.isInfo = true;
						vm.infoMessage = 'User deleted successfully.';
						vm.gridOptions.api.grid.paginationController.loadPage();
					}, function(err){
						vm.isError = true;
						vm.errorMessage = err;
					});
				}
			}
		}

		/**
		 * @method ResetPassword
		 * @description Reset Password
		 * @param user
		 * @constructor
		 */
		function ResetPassword(user) {
			var answer = window.confirm('Do you want to reset password for ' + user.data.Email + ' user?');
			if(answer === true) {
				UserService.ResetPassword(user.data._id).then(function(){
					$rootScope.ShowSuccessNotification('Reset password email has been sent to your registered email address');
				}, function(err){
					$rootScope.ShowErrorNotification(err.Message);
				});
			}
		}
	}

})();