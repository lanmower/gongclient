'use strict'

/*
 * Copyright 2015 Almagest Fraternite All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var module = angular.module('gong.login', ['gong.gapi', 'ngMaterial', 'http-auth-interceptor']);

module.controller('LoginCtrl', ['$http', '$window', '$scope', 'login', 'Restangular', 'authService', function ($http, $window, $scope, loginService, Restangular, authService) {
    $scope.model = {username: "", password: ""};
    console.log('login controller');
    /**
     * Handle the login click.
     */
    $scope.login = function (user) {
        loginService.login(user).then(function () {
            authService.loginConfirmed();
            loginService.data.loggingIn = false;
        });
    };
    $scope.googleSignin = function (user) {
        loginService.googleSignin();
    };
}]);
