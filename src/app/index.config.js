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
    function config($logProvider, $routeProvider, RestangularProvider, $httpProvider, $mdThemingProvider,apiUrl) {
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
        RestangularProvider.setBaseUrl(apiUrl);



        var theme = $mdThemingProvider.theme('default');
        theme.primaryPalette('deep-orange', {
          'default': '400', // by default use shade 400 from the pink palette for primary intentions
          'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
          'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
          'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
        })
        .accentPalette('orange')
        .warnPalette('orange')
        .backgroundPalette('grey')
    }

})();
