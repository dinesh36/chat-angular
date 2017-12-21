(function () {
	'use strict';
	//TODO add this module in the media manager
	angular.module('UserAuthorization', []);
	angular.module('HTMediaManager')
		.factory('UserAuthorizationService', UserAuthorizationService);

	UserAuthorizationService.$inject = ['lodash', '$rootScope', '$location', '$q','$http'];

	function UserAuthorizationService(_, $rootScope, $location, $q,$http) {
		var service = {
			isAuthorized: isAuthorized,
			getUserPermissions: getUserPermissions,
			CheckAuthorized: CheckAuthorized
		};
		return service;

		function CheckLogin(currentURL){
			var deferred = $q.defer();
			var option = {
				method:'GET',
				url:'/admin/checkLogin',
				params:{
					currentURL:currentURL
				}
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

		function getUserPermissions() {
			return $rootScope.userProfile?$rootScope.userProfile.allTokens : undefined;
		}

		function isAuthorized(token, isRedirect) {
			if (token) {
				var permissions = getUserPermissions();
				return checkPermissions(token, permissions, isRedirect);
			}
		}

		function checkPermissions(token, permissions, isRedirect) {
			var deferred = $q.defer();

			//if permission is not there then get the permissions from checkLogin API
			if (!angular.isDefined(permissions)) {
				CheckLogin()
					.then(function (userProfile) {
						$rootScope.userProfile = userProfile;
						permissions = getUserPermissions();
						//call the callback function with the permissions taken from the API
						callBack(permissions);
					})
					.catch(function (e) {
						deferred.reject(e);
					});
			} else {
				//else check auth from the current $rootScope permissions
				callBack(permissions);
			}

			/**
			 * @method callBack
			 * @description private function to check the permission of the user from the token
			 * @param cPermissions
			 */
			function callBack(cPermissions) {
				if (!_.includes(cPermissions, token)) {
					if (!isRedirect) {
						$location.path('/app/dashboard');
					}
					else {
						deferred.resolve(false);
					}
				} else {
					deferred.resolve(true);
				}
			}

			return deferred.promise;
		}

		function CheckAuthorized(token) {
			if (token) {
				var permissions = getUserPermissions();
				if (_.includes(permissions, token)) {
					return true;
				} else {
					return false;
				}
			}
		}
	}
})();