(function () {
    'use strict';

    var app = angular.module('gong');
    app.config(config);

    app.factory('authInterceptor', function ($rootScope, $q, $window) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                }
                return config;
            },
        };
    });

    app.factory('authHttpResponseInterceptor', function ($q, $location, sessionService, $http, $rootScope) {
        return {
            response: function (response) {
                return response || $q.when(response);
            },
            responseError: function (rejection) {
                return $q.reject(rejection);
            }
        }
    });

    /** @ngInject */
    function config($logProvider, $routeProvider, RestangularProvider, $httpProvider) {
        $routeProvider
            .when('/:fileId?', {
                templateUrl: 'app/components/page/page.html',
                controller: 'PageController',
                controllerAs: 'page'
            })
            .otherwise({
                //redirectTo: function() {
                //  console.log("Otherwise...");
                //  return '/edit/';
                //}
            });
        $httpProvider.interceptors.push('authInterceptor');
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
        RestangularProvider.setBaseUrl('http://gong');
    }

})();
