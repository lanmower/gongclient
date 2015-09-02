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

    this.data = {pages: [], loading:true, firstload:true, currentPage: {data: {widgets: []}}};
    var listDeferred = $q.defer();
    this.pageDeferred = null;
    this.getPage = function (location, $scope) {
        self.data.title = '';
        //self.data.currentPage.data = {};
        this.pageDeferred = $q.defer();
        //wait for menu load, then load page based on id info from menu
        this.data.loading = true;
        listDeferred.promise.then(function (data) {
            var id = null;
            if (location == 'logout') {
                loginService.logout().then(function () {
                    console.log('logged out');
                    self.getPages(true).then(function(pages) {});
                }, function (response) {
                    console.log('error');
                });
            } else {
                for (var x = 0; x < data.length; x++) {
                    if (data[x].location == location) {
                        id = data[x].id;
                        self.data.currentPage = data[x];
                        if(self.data.currentPage.page) {
                            if(self.data.firstload != true) {
                                self.data.currentPage.get().then(function() {
                                    self.data.currentPage.data = JSON.parse(self.data.currentPage.page);
                                    self.data.loading = false;
                                    self.pageDeferred.resolve(self.data.currentPage);
                                });
                            } else {
                                self.data.currentPage.data = JSON.parse(self.data.currentPage.page);
                                self.data.firstload = false;
                                self.data.loading = false;
                            }
                        };
                    }
                }
            }
        });
        return this.pageDeferred.promise;
    };

    this.savePage = function () {

        delete this.data.currentPage.copy;
        console.log(this.data.currentPage);
        var page = JSON.stringify(this.data.currentPage.data);
        var title = this.data.currentPage.title;
        this.data.loading = true;
        if(!this.data.currentPage.newItem) {
            this.data.currentPage.patch(
                {'title':title, 'location':this.data.currentPage.location, 'page':page}).then(function () {
                    console.log('saved');
                    self.data.currentPage.edit = false;
                    self.data.loading = false;
                    self.getPages().then(function () {
                        console.log('refreshed');
                    });
                });
        } else {
            delete this.data.currentPage.newItem;
            self.getPages().then(function(data){
                    console.log('new item');
                    data.post({'title':title, 'location':self.data.currentPage.location, 'page':page}).then(function () {
                        console.log('saved');
                        self.data.currentPage.edit = false;
                        self.data.loading = false;
                        self.getPages().then(function () {
                            console.log('refreshed');
                        });
                    });
                }
            );
        }

    }

    this.getPages = function (force) {
        var deferred = listDeferred;
        if (this.data.pages.length == 0 || force) {
            var pages = Restangular.all('v1/page', {'fields': 'id,title,location'});
            pages.getList().then(function (data) {
                data.push({location: 'logout', title: 'Logout', id: 'logout'});
                self.data.pages = data;
                deferred.resolve(data);
            });

        } else {
            deferred.resolve(this.data.pages);
        }
        return deferred.promise;
    }
}])