'use strict'

var cssDone;

angular.module('gong.edit')
    .controller('EditCtrl', ["$sce", "$timeout", "$scope", '$attrs', 'editService', 'pageService', function ($sce, $timeout, $scope, $attrs, editService, pageService) {
        /*if(!$rootScope.modalCssLoaded) {
            var ss = angular.element('<style>');

            ss.text(ss.text()+'@import url("app/components/modal/modal.css");\n');

            $rootElement.append(ss);
            $rootScope.modalCssLoaded = true;
            console.log('loading');
        }*/

        $scope.data = editService.getData();
        $scope.page = pageService.data;
        var updateTypes = function() {
            $scope.types = [];
            for (var i in $scope.page.types) {
                if($scope.page.types[i] == true) {
                    console.log($scope.page.types[i]);
                    //$scope.page.currentPage
                    var types = $scope.page.currentPage.data.types;
                    for (var j in types) {
                        console.log(types[j]);
                        if(types[j] == true && j == i) $scope.types.push(j);
                    }
                }
            }
        }

        $scope.$watch('page.currentPage.data.types', function () {
            console.log($scope.page.currentPage.data.types);
            updateTypes();
        }, true);


        console.log($scope.types);
    }]
);
