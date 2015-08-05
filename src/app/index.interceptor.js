/*global angular:true, browser:true */

/**
 * @license HTTP Auth Interceptor Module for AngularJS
 * (c) 2012 Witold Szczerba
 * License: MIT
 */
(function () {
    'use strict';

    angular.module('http-auth-interceptor', ['http-auth-interceptor-buffer'])

        .factory('authService', ['$rootScope', 'httpBuffer', function ($rootScope, httpBuffer) {
            console.log('factory');
            return {
                /**
                 * Call this function to indicate that authentication was successfull and trigger a
                 * retry of all deferred requests.
                 * @param data an optional argument to pass on to $broadcast which may be useful for
                 * example if you need to pass through details of the user that was logged in
                 */
                loginConfirmed: function (data, configUpdater) {
                    var updater = configUpdater || function (config) {
                            return config;
                        };
                    $rootScope.$broadcast('event:auth-loginConfirmed', data);
                    httpBuffer.retryAll(updater);
                },

                /**
                 * Call this function to indicate that authentication should not proceed.
                 * All deferred requests will be abandoned or rejected (if reason is provided).
                 * @param data an optional argument to pass on to $broadcast.
                 * @param reason if provided, the requests are rejected; abandoned otherwise.
                 */
                loginCancelled: function (data, reason) {
                    httpBuffer.rejectAll(reason);
                    $rootScope.$broadcast('event:auth-loginCancelled', data);
                },

                /**
                 * Call this function to make a function onto every object in the httpBuffer
                 * This allows us to modify the requests
                 */
                transformRequests: function (func) {
                    httpBuffer.transform(func);
                }
            };
        }])

    /**
     * $http interceptor.
     * On 401 response (without 'ignoreAuthModule' option) stores the request
     * and broadcasts 'event:angular-auth-loginRequired'.
     */
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push(['$rootScope', '$q', 'httpBuffer', function ($rootScope, $q, httpBuffer) {
                return {
                    responseError: function (rejection) {

                        if (rejection.status === 403  && !rejection.config.ignoreAuthModule) {
                            var token = $rootScope.refresh_token;
                            console.log('attempting token update');
                            console.log(token);
                            if(token) {
                                authFactory.save({
                                    client_id: 'client_id',
                                    grant_type: 'refresh_token'
                                    // refresh_token: token, sent with the encrypted cookie
                                }, function (obj) {
                                    //update access_token
                                }, function () {
                                    //redirect to login page
                                });
                            }
                            var deferred = $q.defer();
                            httpBuffer.append(rejection.config, deferred);
                            $rootScope.$broadcast('event:auth-loginRequired', rejection);
                            console.log('login required');
                            return deferred.promise;
                        }
                        return $q.reject(rejection);
                    }
                };
            }]);
        }]);

    /**
     * Private module, a utility, required internally by 'http-auth-interceptor'.
     */
    angular.module('http-auth-interceptor-buffer', [])

        .factory('httpBuffer', ['$injector', function ($injector) {
            /** Holds all the requests, so they can be re-requested in future. */
            var buffer = [];

            /** Service initialized later because of circular dependency problem. */
            var $http;

            function retryHttpRequest(config, deferred) {
                function successCallback(response) {
                    deferred.resolve(response);
                }

                function errorCallback(response) {
                    deferred.reject(response);
                }

                $http = $http || $injector.get('$http');
                $http(config).then(successCallback, errorCallback);
            }

            return {
                /**
                 * Appends HTTP request configuration object with deferred response attached to buffer.
                 */
                append: function (config, deferred) {
                    buffer.push({
                        config: config,
                        deferred: deferred
                    });
                },

                /**
                 * Apply a function to every call in the buffer array
                 */
                transform: function (func) {
                    buffer = buffer.map(func);
                },

                /**
                 * Abandon or reject (if reason provided) all the buffered requests.
                 */
                rejectAll: function (reason) {
                    if (reason) {
                        for (var i = 0; i < buffer.length; ++i) {
                            buffer[i].deferred.reject(reason);
                        }
                    }
                    buffer = [];
                },

                /**
                 * Retries all the buffered requests clears the buffer.
                 */
                retryAll: function (updater) {
                    for (var i = 0; i < buffer.length; ++i) {
                        retryHttpRequest(updater(buffer[i].config), buffer[i].deferred);
                    }
                    buffer = [];
                }
            };
        }]);
})();