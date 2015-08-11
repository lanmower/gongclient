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
angular.module('gong.page').controller('PageController', ['$mdDialog', '$rootScope', '$scope', '$routeParams', 'Restangular', 'pageService', function ($mdDialog, $rootScope, $scope, $routeParams, Restangular, pageService) {
    //$scope.data = pageService.getData($routeParams.fileId);
    var self = this;
    $scope.data = pageService.data;
    $scope.data.pageloading = true;
    $scope.currentPage = $scope.data.currentPage;

    pageService.getPage(String($routeParams.fileId)).then(function (data) {
        $scope.data.pageloading = false;
    });

    this.edit = function (index) {
        var widget = $scope.currentPage.data.widgets[index];
        var copy = angular.copy(widget);
        widget.copy = copy;
        widget.edit = true;
    }

    this.addWidget = function (e, index) {
        if ($scope.currentPage.data.widgets.length > 0)
            $scope.currentPage.data.widgets.splice(index, 0, {edit: true, new: true});
        else {
            $scope.currentPage.data.widgets.push({edit: true, new: true});
        }
    }

    this.editPage = function (edit) {
        if (edit == true) $scope.currentPage.copy = angular.copy($scope.currentPage);
        else angular.copy($scope.currentPage.copy, $scope.currentPage);
        $scope.currentPage.edit = edit;
    }

    this.savePage = function () {
        for(var x = 0; x < $scope.currentPage.data.widgets.length; x++) {
            var widget = $scope.currentPage.data.widgets[x];
            widget.edit = false;
            delete widget.copy;
        }
        pageService.savePage($scope);
    }

    /**
     * Handle the save click
     */
    this.save = function (index) {
        console.log($scope.currentPage);
        delete $scope.currentPage.data.widgets[index].copy;
        delete $scope.currentPage.data.widgets[index].new;
        $scope.currentPage.data.widgets[index].edit = false;
    };

    this.remove = function (index) {
        $scope.currentPage.data.widgets.splice(index, 1);
    }

    this.moveUp = function (e, index) {
        $scope.currentPage.data.widgets.splice(index + 1, 0, $scope.currentPage.data.widgets.splice(index, 1)[0]);
    }

    this.moveDown = function (e, index) {
        $scope.currentPage.data.widgets.splice(index - 1, 0, $scope.currentPage.data.widgets.splice(index, 1)[0]);
    }

    /**
     * Handle the cancel click.
     */
    this.cancel = function (index) {
        if ($scope.currentPage.data.widgets[index].new == true) {
            $scope.currentPage.data.widgets.splice(index, 1);
        } else {
            var widget = $scope.currentPage.data.widgets[index];
            widget.edit = false;
            angular.copy(widget.copy, $scope.currentPage.data.widgets[index]);
            delete widget.copy;
        }
    };

}]);
