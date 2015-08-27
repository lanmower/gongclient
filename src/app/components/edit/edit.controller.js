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

    }]
);
