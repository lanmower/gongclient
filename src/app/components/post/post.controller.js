'use strict'

angular.module('gong.post')
    .controller('PostCtrl',
        ["$sce", "$timeout", "$scope", '$attrs', '$mdSidenav', 'Restangular', function ($sce, $timeout, $scope, $attrs, $mdSidenav, Restangular) {
            var posts = Restangular.all('posts');
            $scope.postloading = true;

            posts.getList().then(function(posts) {
                $scope.posts = posts;
                $scope.postloading = false;
              });
        }]
    );
