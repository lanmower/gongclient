(function () {
    'use strict';

    angular
        .module('gong')
        .controller('MainController', [
            '$scope',
            '$location',
            '$routeParams',
            '$q',
            '$mdToast',
            '$mdMedia',
            '$mdSidenav',
            '$log',
            'drive',
            'login',
            'renameDialog',
            'googleApi',
            'Restangular',
            'pageService',
            MainController]);

    /** @ngInject */
    function MainController($scope,
                            $location,
                            $routeParams,
                            $q,
                            $mdToast,
                            $mdMedia,
                            $mdSidenav,
                            $log,
                            drive,
                            login,
                            renameDialog,
                            googleApi,
                            Restangular,
                            pageService) {

        $scope.menu = [];
        pageService.getMenu().then(function (data) {
            $scope.menu = pageService.data.pages;
        });

        $scope.site = {
            title: 'Coastal Accounting Intranet'
        }

        $scope.file = null;
        $scope.loading = true;
        $scope.user = {name: '', image: ''};
        $scope.$mdMedia = $mdMedia;
        $scope.loginData = login.data;

        /** handle menu click */
        this.select = function ($index) {
            window.location.hash = $scope.menu[$index].location;
        }

        /**
         * Displays a short message as a toast
         *
         * @param {String} message Message to display
         */
        var showMessage = function (message) {
            $mdToast.show($mdToast.simple().content(message));
        };

        this.showMenu = function () {
            $mdSidenav('left').toggle();
        }

        this.getUserInfo = function () {
            googleApi.then(function (gapi) {
                // Step 5: Assemble the API request
                var request = gapi.client.plus.people.get({
                    'userId': 'me'
                });
                // Step 6: Execute the API request
                request.then(function (resp) {
                    //$scope.userImage = resp.result.image.url;
                    $scope.user.name = resp.result.displayName;
                    $scope.user.image = resp.result.image.url;
                    $scope.$apply();
                }, function (reason) {
                });
            });
        }
    }
})();
