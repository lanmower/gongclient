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
angular.module('gong.form').controller('FormController', ['$mdDialog', '$rootScope', '$scope', function ($mdDialog, $rootScope, $scope) {
    var self = this;
    $scope.data = {formloading: true};
    $scope.contents.types = ['announcement', 'text', 'textArea', 'checkBox', 'radioButton','select'];
    if(!$scope.contents.widgets) $scope.contents.widgets = [];
    this.edit = function (index) {
        var widget = $scope.contents.widgets[index];
        var copy = angular.copy(widget);
        widget.copy = copy;
        widget.edit = true;
    }

    this.addWidget = function (index) {
        if ($scope.contents.widgets.length > 0)
            $scope.contents.widgets.splice(index, 0, {edit: true, new: true});
        else {
            $scope.contents.widgets.push({edit: true, new: true});
        }
    }

    /**
     * Handle the save click
     */
    this.save = function (index) {
        delete $scope.contents.widgets[index].copy;
        delete $scope.contents.widgets[index].new;
        $scope.contents.widgets[index].edit = false;
        $mdDialog.hide();
    };

    this.remove = function (data, index) {
        data.splice(index, 1);
    }

    this.moveUp = function (index) {
        $scope.contents.widgets.splice(index + 1, 0, $scope.contents.widgets.splice(index, 1)[0]);
    }

    this.moveDown = function (index) {
        $scope.contents.widgets.splice(index - 1, 0, $scope.contents.widgets.splice(index, 1)[0]);
    }
}]);
