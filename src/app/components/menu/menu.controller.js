(function () {
    'use strict';

    angular
        .module('gong.menu')
        .controller('MenuCtrl', [
            '$scope',
            'login',
            'pageService',
            'Restangular',
            MenuController]);

    /** @ngInject */
    function MenuController($scope, login, pageService, Restangular) {

        $scope.menu = [];
        pageService.getPages().then(function (data) {
            $scope.menu = pageService.data.pages;
            console.log($scope.menu);
        });
        $scope.loginData = login.data;
        /** handle menu click */
        this.select = function ($index) {
            window.location.hash = $scope.menu[$index].location;
        }
        this.openMenu = function($mdOpenMenu, ev) {
            $mdOpenMenu(ev);
        }
        this.showMenu = function (side) {
            if(!side) side = "left";
            $mdSidenav(side).toggle();
        }
        this.edit = function (edit) {
            console.log(pageService.data.currentPage);
            if (edit == true) pageService.data.currentPage.copy = angular.copy(pageService.data.currentPage);
            else angular.copy(pageService.data.currentPage.copy, pageService.data.currentPage);
            pageService.data.currentPage.edit = edit;
            console.log('test');
        }

        this.add = function (item, items) {
            var index = items.indexOf(item);
            var newItem = {newItem: true, type:$scope.create, data:{widgets:[]}, types:['announcement'], location:'new', title:'Untitled Page'};
            items.splice(index, 0, newItem);
            this.edit(true);
        }

    }
})();
