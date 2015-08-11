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
angular.module('gong.page', ['restangular', 'ngSanitize']).service('pageService', ['$http', '$q', '$mdDialog', 'Restangular', 'login', function ($http, $q, $mdDialog, Restangular, loginService) {
    var self = this;

    this.data = {pages: [], currentPage: {data: {widgets: []}}};

    this.getPage = function (location, $scope) {
        self.data.title = '';
        self.data.currentPage.data = {};
        var deferred = $q.defer();
        //wait for menu load, then load page based on id info from menu
        this.menuDeferred.promise.then(function (data) {
            var id = null;
            for (var x = 0; x < data.length; x++) {
                if (data[x].location == location) {
                    id = data[x].id;
                    self.data.currentPage.title = data[x].title;
                }
            }
            if (location == 'logout') {
                loginService.logout().then(function () {
                    console.log('logged out');
                }, function (response) {
                    console.log('error');
                });
            } else {
                var success = function (response) {
                    if (typeof response.page == 'string') {
                        var data = JSON.parse(response.page).data;
                        angular.copy(response, self.data.currentPage);
                        self.data.currentPage.data = JSON.parse(response.page);
                   }
                    deferred.resolve(response);
                };
                self.page = Restangular.one('v1/page', id);
                self.page.get().then(success, function (response) {
                    console.log('error getting page');
                });
            }
        });
        return deferred.promise;
    };

    this.savePage = function () {
        delete this.data.currentPage.copy;
        var page = JSON.stringify(this.data.currentPage.data);
        console.log("PAGE:"+page);
        var title = this.data.currentPage.title;
        this.data.pageloading = true;
        self.page.patch(
            {'title':title, 'page':page}).then(function () {
                self.data.currentPage.edit = false;
                self.data.pageloading = false;
                self.getMenu(true).then(function () {
                });
            });
    }

    this.menuDeferred = $q.defer();
    this.getMenu = function (force) {
        var deferred = this.menuDeferred;
        if (this.data.pages.length == 0 || force) {
            var pages = Restangular.all('v1/page', {'fields': 'id,title,location'});
            pages.getList().then(function (data) {
                data.push({location: 'logout', title: 'Logout', id: 'logout'});
                angular.copy(data, self.data.pages);
                deferred.resolve(data);
            });
        } else {
            deferred.resolve(this.data.pages);
        }
        return deferred.promise;
    }


}])