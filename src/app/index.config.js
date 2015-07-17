(function() {
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
            response: function (response) {
                if (response.status === 401) {
                    console.log('log in plz');
                    // handle the case where the user is not authenticated
                }
                return response || $q.when(response);
            }
        };
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
        RestangularProvider.setBaseUrl('http://advanced');
  }

})();
