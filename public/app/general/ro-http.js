/**
 * Created by dinesh on 5/4/16.
 */
(function () {
    'use strict';
    /**
     * @name RoHttp
     * @description
     * RoHttp is a wrapper for the $http.
     */
    angular.module('RoServices',[])
        .service('RoHttp',RoHttp);
    RoHttp.$inject = ['$http', '$log', '$rootScope', '$q', 'lodash'];
    function RoHttp($http, $log, $rootScope, $q, _) {

        return {
                callAPI: callAPI,
                removePending: removePanding
            };

            //TODO function to remove the panding requests
            function removePanding() {

            }

            /**
             * @method RoHttp
             * @param {object} request request data to call the api
             *        <ul>
             *            <li>showLoader - option to show the loader</li>
             *            <li>setStatus - setting the status 'success' or 'error'</li>
             *        </ul>
             * @return {promise} return the promise of the api call
             *
             * @description
             * Method for the wrapper of $http
             */
            function callAPI(request) {
                _init();
                var requestPromise = $q.defer();
                $http(request)
                    .success(_success)
                    .error(_error)
                    .finally(_finally);
                return requestPromise.promise;

                /**
                 * @method _init
                 * @description
                 * function to be called when initializing
                 */
                function _init(){
                    request.showLoader = _.isUndefined(request.showLoader)? true:request.showLoader;
                    request.setStatus = _.isUndefined(request.setStatus)?false:request.setStatus;
                    request.method = request.method || 'GET';

                    //set the loading indicator
                    if (request.showLoader) {
                        $rootScope.$broadcast('loader_show');
                    }
                    //set the loading status
                    if (request.setStatus) {
                        $rootScope.RoHttpStatus = 'loading';
                    }
                }

                /**
                 * @method _success
                 * @description
                 * function to be called when success response is recieved from the http request
                 */
                function _success(response) {
                    if (response && response.Status === 'success') {
                        $log.debug('RoHttp : this is success in getting the response :: ' + request.url);
                        requestPromise.resolve(response.Data);
                        if (request.setStatus) {
                            $rootScope.RoHttpStatus = 'success';
                        }
                    } else {
                        _error(response);
                    }
                }

                /**
                 * @method _error
                 * @description
                 * function to be called when error response is recieved from the http request
                 */
                function _error(response) {
                    $log.error('RoHttp : this is error in getting the response :: ' + request.url);
                    if (!_.isObject(response)) {
                        $log.error('response is not an Object:' + response);
                        response = {
                            Error: {
                                Code:'0000',
                                Message:'Something went wrong',
                                Name:'InvalidResponse'
                            },
                            Status: 'failure'
                        };
                    }
                    requestPromise.reject(response);
                    if (request.setStatus) {
                        $rootScope.RoHttpStatus = 'error';
                    }
                }

                /**
                 * @method _finally
                 * @description
                 * function to be called when http request is complete
                 */
                function _finally(){
                    if (request.showLoader) {
                        $rootScope.$broadcast('loader_hide');
                    }
                }
            }
        }
})();
