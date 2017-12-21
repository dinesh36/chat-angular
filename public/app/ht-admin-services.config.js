'use strict';
(function(){
	angular
		.module('HTAdminServices')
		.config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide','$httpProvider',Config])
		.run(['$http',Run]);

	function Config($controllerProvider,$compileProvider,$filterProvider,$provide,$httpProvider) {	        
		$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
		$httpProvider.interceptors.push('APIInterceptor');
	}
	function Run($http){

	}
})();