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
 angular.module('gong.page',['restangular']).service('pageService', ['$http', '$q', '$mdDialog', 'Restangular',function($http, $q, $mdDialog, Restangular) {
     var self = this;

     this.data = {pages: [], currentPage:{data:{widgets:[]}}};

     this.getPage = function(location, $scope) {
         self.data.title = '';
         self.data.currentPage.data = {};
         var deferred=$q.defer();
         var page = Restangular.all('page');
         //wait for menu load, then load page based on id info from menu
         this.menuDeferred.promise.then(function(data) {
             var id = null;
             for(var x = 0; x < data.length; x++) {
                 if(data[x].location == location) {
                     id = data[x].id;
                     self.data.currentPage.title = data[x].title;
                 }
             }

             self.page = Restangular.one('page',id);
             if(location == 'logout'){self.page = Restangular.one('site',id);}
             self.page.get().then(function(response) {
                 response.data = JSON.parse(response.page).data;
                 angular.copy(response, self.data.currentPage);
                 deferred.resolve(response);
             }, function(response) {
                 console.log('error');
             });
         });
         return deferred.promise;
     }

     this.savePage = function() {
         delete this.data.currentPage.copy;
         this.page.page = JSON.stringify(this.data.currentPage);
         this.page.title = this.data.currentPage.title;
         console.log(this.page);
         var encoded = {page:this.page.page, title:this.page.title};
         this.data.pageloading = true;
         this.page.put(
             []).then(function() {
                 self.data.currentPage.edit = false;
                 self.data.pageloading = false;
                 self.getMenu(true).then(function() {
                     console.log(self.data.pages);
                 });
             });
     }

     this.menuDeferred=$q.defer();
     this.getMenu = function(force) {
         var deferred = this.menuDeferred;
         if(this.data.pages.length == 0 || force) {
             console.log('test');
             var pages = Restangular.all('page',{'fields':'id,title,location'});
             pages.getList().then(function(data) {
                 data.push({location: 'logout', title:'Logout', id:'logout'});
                 angular.copy(data,self.data.pages);
                 deferred.resolve(data);
             });
         } else {
             deferred.resolve(this.data.pages);
         }
         return deferred.promise;
     }


}])