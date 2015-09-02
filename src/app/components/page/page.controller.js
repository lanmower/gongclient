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
angular.module('gong.page').controller('PageController', ['$mdDialog', '$timeout', '$rootScope', '$scope', '$routeParams', 'Restangular', 'pageService', function ($mdDialog, $timeout, $rootScope, $scope, $routeParams, Restangular, pageService) {
    //$scope.data = pageService.getData($routeParams.fileId);
    var self = this;
    $scope.data = pageService.data;
    $scope.data.loading = true;
    pageService.getPage(String($routeParams.fileId)).then(function (data) {
        $scope.data.loading = false;
    });

    this.edit = function (edit) {
        if (edit == true) $scope.data.currentPage.copy = angular.copy($scope.data.currentPage);
        else angular.copy($scope.data.currentPage.copy, $scope.data.currentPage);
        $scope.data.currentPage.edit = edit;
    }

    this.save = function () {
        for(var x = 0; x < $scope.data.currentPage.data.widgets.length; x++) {
            var widget = $scope.data.currentPage.data.widgets[x];
            widget.edit = false;
            delete widget.copy;
        }
        pageService.savePage();
    }

    $scope.selection = [[],[]];
    $scope.$watch('selection', function () {
        $scope.data.types = [];
        angular.forEach($scope.selection, function (value, index) {
            $scope.data.types[index]=value;
        });
    }, true);
}]);
