'use strict';
(function(){
	angular.module('HTAdminApp')
		.run(['$rootScope', '$state', '$stateParams', '$location','ChatService', RunHTAdminApp])
		.config(['$stateProvider', '$urlRouterProvider', ConfigHTAdminApp])
		.value('froalaConfig', {
			'key':'oGLGTI1DMJc1BWLg1PO=='
		});

	/**
	 * @method ConfigHTAdminApp
	 * @description function to set the configurations
	 * @constructor
     */
	function ConfigHTAdminApp($stateProvider, $urlRouterProvider){
		$urlRouterProvider.otherwise('/app/dashboard');
		$stateProvider.state('contentEditor', {
			url:'/contentEditor',
			templateUrl:'/admin/app/modules/content-editor/templates/contentEditor.html',
			controller: 'contentEditorCtrl',
			controllerAs:'vm',
			resolve:{
				'userProfile':['UserService', '$q', '$rootScope', CheckLogin]
			}
		});
		$stateProvider.state('app', {
				abstract:true,
				url:'/app',
				templateUrl:'/app/layout/app.html',
				resolve:{
					'userProfile':['UserService', '$q', '$rootScope', CheckLogin]
				}
			})
			.state('app.dashboard', {
				url:'/dashboard',
				controllerAs:'vm',
				template:'<div>hello</div>'
			});
	}

	/**
	 * @method RunHTAdminApp
	 * @description function to be called when application is ready to run
     * @constructor
     */
	function RunHTAdminApp($rootScope, $state, $stateParams,$location,ChatService){
		ChatService.init();
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
		$rootScope.errorMessage = '';
		$rootScope.isError = false;
		$rootScope.successMessage = '';
		$rootScope.isSuccess = false;
		$rootScope.showloading = false;
		$rootScope.loadingMessage = '';
		$rootScope.title = 'HT Admin';
		$rootScope.userProfile = {};
		$rootScope.showProgress = function(msg){
			if(msg === undefined){
				msg = 'Loading...';
			}
			$rootScope.showloading = true;
			$rootScope.loadingMessage = msg;
		};
		$rootScope.hideProgress = function(){
			$rootScope.showloading = false;
		};
		
		//set the run environment
		var env = window.location.hostname.split('.')[0].toUpperCase();
		if(env==='WWW' || env==='HARRISTEETER') {
			env='PRODUCTION';
		}

		$rootScope.app = {
			ENV:env,
			IsProduction:env==='BETA' || env==='PRODUCTION'
		};
		activate();

		/**
		 * @method activate
		 * @description function to be called when active
         */
		function activate(){
			$rootScope.$on('$stateChangeSuccess', function(event, toState){
				$rootScope.title = toState.title || 'HT Admin';
				$(window).scrollTop(0);
			});
			$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState){
			});
			$rootScope.$on('$stateChangeError', function(){
				$rootScope.$emit('$progressEnd');
			});
		}
	}

	/**
	 * @method CheckLogin
	 * @description function to check if user is logged in or not
	 * @returns {*|promise}
     * @constructor
     */
	function CheckLogin(UserService, $q, $rootScope){
		var deferred = $q.defer();
		deferred.resolve({});
		// UserService.CheckLogin(window.location.hash)
		// 	.then(function(userProfile){
		// 		$rootScope.userProfile = userProfile;
		// 		deferred.resolve(userProfile);
		// 	})
		// 	.catch(function(){
		// 		window.location = '/admin/#/login';
		// 	});
		return deferred.promise;
	}
})();