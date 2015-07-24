'use strict'

angular.module('gong.calendar')
    .controller('CalendarCtrl',
    ["$sce", "$timeout", "$scope", '$attrs', '$mdSidenav', function ($sce, $timeout, $scope, $attrs, $mdSidenav) {
        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        }
        $sce.trustAsResourceUrl($scope.url);
    }]
);
