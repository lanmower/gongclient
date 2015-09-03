(function () {
    'use strict';

    angular
        .module('gong.menu')
        .controller('MenuCtrl', [
            '$scope', '$rootScope','$q',
            'login',
            'pageService',
            'Restangular',
            MenuController]);

    /** @ngInject */
    function MenuController($scope, $rootScope, $q, login, pageService, Restangular) {

        $scope.menu = [];
        pageService.getPages().then(function (data) {
            $scope.menu = pageService.data.pages;
        });
        $scope.loginData = login.data;
        /** handle menu click */
        this.select = function ($index) {
            window.location.hash = $scope.menu[$index].location;
            return true;
        }
        this.openMenu = function($mdOpenMenu, ev) {
            $mdOpenMenu(ev);
        }
        this.showMenu = function (side) {
            if(!side) side = "left";
            $mdSidenav(side).toggle();
        }
        this.edit = function ($index, item, edit) {
            if($scope.menu[$index]) {
                window.location.hash = $scope.menu[$index].location;
                if (edit == true) item.copy = angular.copy(item);
                else angular.copy(item.copy, item);
                item.edit = edit;
                return true;
            }
        }

        this.add = function (item, items) {
            var index = items.indexOf(item);
            var newItem = {newItem: true, type:$scope.create, data:{widgets:[]}, types:{'announcement':true}, location:'new', title:'Untitled Page'};
            items.splice(index, 0, newItem);
            this.edit(true);
        }

        this.remove = function (item, items) {
            var idx = items.indexOf(item);
            item.remove().then(function() {
                var index = items.indexOf(item);
                if (index > -1) items.splice(index, 1);
            });
        }

    }
})();
