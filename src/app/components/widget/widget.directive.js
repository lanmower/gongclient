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

angular.module('gong.widget').directive('widget', function ($compile, $http, $templateCache) {

    return {
        restrict: "E",
        link: function (scope, element) {
            var refresh = function () {
                var partial = 'app/partials/';
                partial += ''+scope.type+'/';
                partial += scope.contents.type;
                partial += scope.edit ? 'Edit' : '';
                partial += '.html';
                $http.get(partial, {cache: $templateCache}).then(function (result) {
                    element.html(result.data);
                    $compile(element.contents())(scope);
                });
            }
            //if(scope.edit) {
                scope.$watch('contents.type', function (newValue, oldValue) {
                    if (newValue) {
                        refresh();
                    }
                }, true);
            //};

        },
        scope: {
            contents: '=',
            type: '@',
            edit: '='
        }
    };
});
