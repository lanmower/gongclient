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
angular.module('gong.widget').controller('WidgetsCtrl', ['$mdDialog', '$timeout', '$rootScope', '$scope', '$routeParams', 'Restangular', 'pageService', 'editService', function ($mdDialog, $timeout, $rootScope, $scope, $routeParams, Restangular, pageService, editService) {
    var self = this;
    $scope.page = pageService.data.currentPage;
    this.add = function (item, items) {
        var index = items.indexOf(item);
        var newItem = {new: true, type:$scope.create};
        items.splice(index, 0, newItem);
        this.edit(newItem, items);
        //if (index) {
        //} else {
        //    items.push({new: true});
        //}
    }

    this.edit = function (item, items) {
        editService.setWidget(item);
        console.log(item);
        if(item.edit != true) {
            var copy = angular.copy(item);
            item.copy = copy;
            item.edit = true;
            editService.setEditing(true);
        } else {
            this.cancel(item, items)
        }
    }

    this.openMenu = function($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
    }

    this.cancel = function (item, items) {
        editService.setEditing(false);
        console.log(item);
        var index = items.indexOf(item);
        if (item.new == true) {
            items.splice(index, 1);
        } else {
            var item = items[index];
            item.edit = false;
            editService.setEditing(false);
            angular.copy(item.copy, items[index]);
            delete item.copy;
        }
    };

    this.save = function (item) {
        editService.setEditing(false);
        console.log(item);
        delete item.copy;
        delete item.new;
        editService.setEditing(false);
        item.edit = false;
    };

    this.moveUp = function (items, item) {
        console.log(item);
        var idx = items.indexOf(item);
        items.splice(idx, 1);
        $timeout(function(){
            items.splice(idx-1, 0, item);
        });
    }

    this.moveDown = function (items, item) {
        console.log(item);
        var idx = items.indexOf(item);
        items.splice(idx, 1);
        $timeout(function(){
            items.splice(idx+1, 0, item);
        });
    }

    this.remove = function (item, items) {
        var idx = items.indexOf(item);
        items.splice(idx, 1);
    }
}]);
