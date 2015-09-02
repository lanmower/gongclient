(function () {
    'use strict';

    angular
        .module('gong')
        .controller('MainController', [
            '$scope',
            '$location',
            '$routeParams',
            '$q',
            '$rootScope',
            '$mdToast',
            '$mdMedia',
            '$rootElement',
            '$mdSidenav',
            '$log',
            'drive',
            'login',
            'renameDialog',
            'googleApi',
            'Restangular',
            'pageService',
            'editService',
            MainController]);

    /** @ngInject */
    function MainController($scope,
                            $location,
                            $routeParams,
                            $q,
                            $rootScope,
                            $mdToast,
                            $mdMedia,
                            $rootElement,
                            $mdSidenav,
                            $log,
                            drive,
                            login,
                            renameDialog,
                            googleApi,
                            Restangular,
                            pageService,
                            editService) {

        $scope.site = {
            title: 'Coastal Accounting Intranet'
        }

        $scope.file = null;
        $scope.loading = true;
        $scope.user = {name: '', image: ''};
        $scope.$mdMedia = $mdMedia;
        $scope.loginData = login.data;
        $scope.page = pageService.data;
        $scope.edit = editService.getData();
        console.log($scope.loginData);

        if(!$rootScope.modalCssLoaded) {
         var ss = angular.element('<style>');

         ss.text(ss.text()+'@import url("app/components/main/main.css");\n');

         $rootElement.append(ss);
         $scope.cssLoaded = true;
         console.log('loading css');
         }

        /**
         * Displays a short message as a toast
         *
         * @param {String} message Message to display
         */
        var showMessage = function (message) {
            $mdToast.show($mdToast.simple().content(message));
        };

        this.showMenu = function (side) {
            if(!side) side = "left";
            $mdSidenav(side).toggle();
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
