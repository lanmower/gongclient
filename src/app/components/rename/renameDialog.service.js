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

angular.module('gong.rename').service('renameDialog', ['$mdDialog', function ($mdDialog) {
    /**
     * Displays a dialog for renaming the file.
     *
     * @param {Event} $event Original click event for animations
     * @param {String} title Original document title
     * @return {Promise} Promise that resolves with the new title when the dialog is closed
     */
    this.show = function ($event, title) {
        return $mdDialog.show({
            targetEvent: $event,
            templateUrl: "app/components/rename/rename.html",
            controller: 'RenameCtrl',
            controllerAs: 'ctrl',
            locals: {
                title: title
            }
        });
    };
}]);
