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
angular.module('gong.form', ['restangular']).service('formService', ['$http', '$q', '$mdDialog', 'Restangular', 'login', function ($http, $q, $mdDialog, Restangular, loginService) {
    var self = this;

    this.data = {forms: [], currentForm: {data: {widgets: []}}};

    this.getForm = function (location, $scope) {
        self.data.title = '';
        self.data.currentForm.data = {};
        var deferred = $q.defer();
        //wait for menu load, then load form based on id info from menu
        this.menuDeferred.promise.then(function (data) {
            var id = null;
            for (var x = 0; x < data.length; x++) {
                if (data[x].location == location) {
                    id = data[x].id;
                    self.data.currentForm.title = data[x].title;
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
                    if (typeof response.form ==  'string') {
                        var data = JSON.parse(response.form).data;
                        console.log('data');
                        console.log(response);
                        angular.copy(response, self.data.currentForm);
                        self.data.currentForm.data = JSON.parse(response.form);
                        console.log('current form');
                        console.log(self.data.currentForm);
                    }
                    deferred.resolve(response);
                };
                self.form = Restangular.one('v1/form', id);
                self.form.get().then(success, function (response) {
                    console.log('error getting form');
                });
            }
        });
        return deferred.promise;
    };

    this.saveForm = function () {
        delete this.data.currentForm.copy;
        self.form.form = null;
        var form = JSON.stringify(this.data.currentForm.data);
        var title = this.data.currentForm.title;
        this.data.formloading = true;
        self.form.patch(
            {'title':title, 'form':form}).then(function () {
                self.data.currentForm.edit = false;
                self.data.formloading = false;
                self.getMenu(true).then(function () {
                });
            });
    }

    this.menuDeferred = $q.defer();
    this.getMenu = function (force) {
        var deferred = this.menuDeferred;
        if (this.data.forms.length == 0 || force) {
            var forms = Restangular.all('v1/form', {'fields': 'id,title,location'});
            forms.getList().then(function (data) {
                data.push({location: 'logout', title: 'Logout', id: 'logout'});
                angular.copy(data, self.data.forms);
                deferred.resolve(data);
            });
        } else {
            deferred.resolve(this.data.forms);
        }
        return deferred.promise;
    }


}])