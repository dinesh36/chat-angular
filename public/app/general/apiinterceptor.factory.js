(function() {
	'use strict';
	angular
		.module('HTAdminServices')
		.factory('APIInterceptor', factory);
	factory.$inject = ['$q', '$window', 'lodash'];
	function factory($q, $window, _) {
		return {
			'request':Request,
			'response':Response,
			'requestError':RequestError,
			'responseError':ResponseError
		};

		/**
		 * @method request
		 * @description function to override the http request
		 * @param config
		 * @returns {*}
		 * @constructor
		 * @ticket RED-569, RED-565, RED-570, RED-577
		 */
		function Request(config) {
			if ((config.method === 'GET' && config.url.indexOf('/admin/') > -1 && config.url.indexOf('.html') === -1) || config.url.indexOf('nav.html') > -1) {
				config.params = config.params || {};
				config.params._dc = Math.random();
			}
			return config;
		}

		/**
		 * @method Response
		 * @description function to override the http response
		 * @param response
		 * @returns {*}
		 * @constructor
		 */
		function Response(response){
			return response;
		}

		/**
		 * @method RequestError
		 * @description function to override the http request error
		 * @param rejection
		 * @returns {*|Array}
		 * @constructor
		 */
		function RequestError(rejection){
			return $q.reject(rejection);
		}

		/**
		 * @method ResponseError
		 * @description function to override the http response error
		 * @param rejection
		 * @returns {*|Array}
		 * @constructor
		 */
		function ResponseError(rejection){
			if ((rejection.status === 0 || rejection.status === 500) && !_.get(rejection, 'data.Error.Message')) {
				$window.alert('I\'m sorry, something went wrong on our end. If it happens again send us feedback and we will get back to you asap.');
			} else if (rejection.status === 401 && $window.location.hash !== '#/login') {
				$window.location = '/admin/logout';
			}
			return rejection;
		}
	}
})();