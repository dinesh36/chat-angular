'use strict';
(function(){
	angular
		.module('HTAdminApp')
		.factory('UserService', UserService);

	UserService.$inject = ['$http', '$q','RoHttp'];
	function UserService($http, $q,RoHttp){
		return {
			CheckLogin:CheckLogin,
			UserList:UserList,
			AddUser:AddUser,
			DeleteUser:DeleteUser,
			ResetPassword:ResetPassword,
			GetUserDetails:GetUserDetails,
			EditUser:EditUser,
			RoleList:RoleList,
			unLockUser:unLockUser
		};

		/**
		 * @method unLockUser
		 * @description function to unlock the user
		 * @param id
		 * @returns {promise}
		 * @ticket BOMB-590
		 */
		function unLockUser(id){
			return RoHttp.callAPI({
				method:'PUT',
				url:'/admin/users/unlock-user/'+id
			});
		}

		/**
		 * @method CheckLogin
		 * @description function to check the login status
		 * @param currentURL
		 * @returns {*|promise}
		 */
		function CheckLogin(currentURL){
			var deferred = $q.defer();
			var option = {
				method:'GET',
				url:'/admin/checkLogin',
				params:{
					currentURL:currentURL
				}
			};
			$http(option).success(function(data){
				if(data.Status === 'success'){
					deferred.resolve(data.Data);
				} else{
					deferred.reject(data.Error);
				}
			}).error(function(data){
				deferred.reject(data);
			});
			return deferred.promise;
		}

		/**
		 * @method UserList
		 * @description function to get the user List
		 * @param query
		 * @returns {*|promise}
		 */
		function UserList(query){
			var deferred = $q.defer();
			var option = {
				method:'GET',
				url:'/admin/users',
				params:query
			};
			$http(option).success(function(data){
				if(data.Status === 'success'){
					deferred.resolve(data.Data);
				} else{
					deferred.reject(data.Error);
				}
			}).error(function(data){
				deferred.reject(data);
			});
			return deferred.promise;
		}

		/**
		 * @method AddUser
		 * @description function to add user
		 * @param postObj
		 * @returns {*|promise}
		 */
		function AddUser(postObj){
			var deferred = $q.defer();
			var option = {
				method:'POST',
				url:'/admin/users',
				data:postObj
			};
			$http(option).success(function(data){
				if(data.Status === 'success'){
					deferred.resolve(data.Data);
				} else{
					deferred.reject(data.Error);
				}
			}).error(function(data){
				deferred.reject(data);
			});
			return deferred.promise;
		}

		/**
		 * @method DeleteUser
		 * @description function to delete user
		 * @param userId
		 * @returns {*|promise}
		 */
		function DeleteUser(userId){
			var deferred = $q.defer();
			var option = {
				method:'DELETE',
				url:'/admin/users/'+userId
			};
			$http(option).success(function(data){
				if(data.Status === 'success'){
					deferred.resolve(data.Data);
				} else{
					deferred.reject(data.Error);
				}
			}).error(function(data){
				deferred.reject(data);
			});
			return deferred.promise;
		}

		/**
		 * @method ResetPassword
		 * @description function to reset the password
		 * @param userId
		 * @returns {*|promise}
		 */
		function ResetPassword(userId) {
			var deferred = $q.defer();
			var option = {
				method:'PUT',
				url:'/admin/users/' + userId + '/reset-password'
			};
			$http(option).success(function(data, status, headers){
				if(data.Status == 'success'){
					deferred.resolve(data.Data);
				} else{
					deferred.reject(data.Error);
				}
			}).error(function(data, status, headers){
				deferred.reject(data);
			});
			return deferred.promise;
		}

		/**
		 * @method GetUserDetails
		 * @description function to get user details
		 * @param userId
		 * @param opt
		 * @returns {*|promise}
		 */
		function GetUserDetails(userId, opt){
			var deferred = $q.defer();
			var option;
			if(opt === 'reset'){ // while reset password we use following path to get userdetail
				option = {
					method:'GET',
					url:'/admin/users/reset/' + userId + '?option=' + opt
				};
			} else{
				option = {
					method:'GET',
					url:'/admin/users/' + userId + '?option=' + opt
				};
			}
			$http(option).success(function(data){
				if(data.Status === 'success'){
					deferred.resolve(data.Data);
				} else{
					deferred.reject(data.Error);
				}
			}).error(function(data){
				deferred.reject(data);
			});
			return deferred.promise;
		}

		/**
		 * @method EditUser
		 * @description function to edit user
		 * @param userId
		 * @param postObj
		 * @returns {*|promise}
		 */
		function EditUser(userId, postObj) {
			var deferred = $q.defer();
			var option = {
				method:'PUT',
				url:'/admin/users/'+userId,
				data:postObj
			};
			$http(option).success(function(data){
				if(data.Status === 'success'){
					deferred.resolve(data.Data);
				} else{
					deferred.reject(data.Error);
				}
			}).error(function(data){
				deferred.reject(data);
			});
			return deferred.promise;
		}

		/**
		 * @method RoleList
		 * @description function to get the roles
		 * @returns {*|promise}
		 */
		function RoleList(){
			var deferred = $q.defer();
			var option = {
				method:'GET',
				url:'/admin/roles/getAllRoles'
			};
			$http(option).success(function(data){
				if(data.Status === 'success'){
					deferred.resolve(data.Data);
				} else{
					deferred.reject(data.Error);
				}
			}).error(function(data){
				deferred.reject(data);
			});
			return deferred.promise;
		}
	}
})();