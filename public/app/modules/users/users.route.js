(function(){
	angular
		.module('HTAdminApp')
		.config(Config);
	Config.$inject = ['$stateProvider', '$urlRouterProvider'];
	function Config($stateProvider, $urlRouterProvider){
		$stateProvider
			.state('app.users', {
				url:'/users',
				abstract:true,
				templateUrl:'/admin/app/layout/abstract.html',
				onEnter:function($rootScope){
					$rootScope.isError = false;
					$rootScope.isSuccess = false;
				}
			})
			.state('app.users.list', {
				url:'/list',
				controller:'UsersListController',
				controllerAs:'vm',
				resolve:{
					'authorization':['UserAuthorizationService',function checkAuthorization(UserAuthorizationService){
                    	return UserAuthorizationService.isAuthorized('USER_CANVIEW',false);
                	}],
					'userList':['UserService', function(UserService){
						return UserService.UserList({rows:50, pageNo:1});
					}],
					'roleList':['RoleService', function(RoleService){
						return RoleService.RoleList({rows:50, pageNo:1});
					}]
				},
				templateUrl:'/admin/app/modules/users/templates/users-list.html'
			})
			.state('app.users.new', {
				url:'/new',
				templateUrl:'/admin/app/modules/users/templates/new-user.html',
				controller:'NewUserController',
				controllerAs:'vm',
				resolve:{
					'authorization':['UserAuthorizationService',function checkAuthorization(UserAuthorizationService){
                    	return UserAuthorizationService.isAuthorized('USER_CANADD',false);
                	}],
					'roleList':['UserService', function(UserService){
						return UserService.RoleList();
					}]
				}
			})
			.state('app.users.edit', {
				url:'/:id/edit',
				templateUrl:'/admin/app/modules/users/templates/new-user.html',
				controller:'EditUserController',
				controllerAs:'vm',
				resolve:{
					'authorization':['UserAuthorizationService',function checkAuthorization(UserAuthorizationService){
                    	return UserAuthorizationService.isAuthorized('USER_CANEDIT',false);
                	}],
					'userDetails':['UserService', '$stateParams', function(UserService, $stateParams){
						return UserService.GetUserDetails($stateParams.id);
					}],
					'roleList':['UserService', function(UserService){
						return UserService.RoleList();
					}],
					'PageCategory':['SettingsService', function(SettingsService) {
							return SettingsService.getPageCategoryList({rows:50, pageNo:1, sortBy:'LastModifyOn', sortOrder:-1});
					}]
				}
			});
	}
})();