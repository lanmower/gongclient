'use strict'
angular.module('gong.player')
    .controller('PlayerCtrl',
    ["$sce", "$timeout", "$scope", '$mdSidenav', function ($sce, $timeout, $scope, $mdSidenav) {
        $scope.state = null;
        $scope.API = null;
        $scope.currentVideo = 0;

        $scope.videos = [
            /*{
                title: "asdf",
                sources: [
                    {
                        src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"),
                        type: "video/mp4"
                    },
                    {
                        src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"),
                        type: "video/webm"
                    },
                    {
                        src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"),
                        type: "video/ogg"
                    }
                ]
            },
            {
                title: "asdf",
                sources: [
                    {
                        src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/big_buck_bunny_720p_h264.mov"),
                        type: "video/mp4"
                    },
                    {
                        src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/big_buck_bunny_720p_stereo.ogg"),
                        type: "video/ogg"
                    }
                ]
            }*/

        ];

        $scope.config = {
            preload: "none",
            autoHide: false,
            autoHideTime: 3000,
            autoPlay: true,
            sources: [
                {
                    src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"),
                    type: "video/mp4"
                },
                {
                    src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"),
                    type: "video/webm"
                },
                {
                    src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"),
                    type: "video/ogg"
                }
            ],
            theme: {
                url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
            },
            plugins: {
                //poster: "http://www.videogular.com/assets/images/videogular.png"
            }
        };
        $scope.videos.selected = $scope.videos[0];
        this.select = function (index) {
            $scope.API.stop();
            $scope.currentVideo = index;
            $scope.videos.selected = $scope.videos[index];
            $scope.config.sources = $scope.videos[index].sources;
            $timeout($scope.API.play.bind($scope.API), 100);
        };

        this.showPlayer = function () {
            $mdSidenav('right').toggle();
        }

        this.onPlayerReady = function (API) {
            $scope.API = API;
        };

        this.onCompleteVideo = function () {
            $scope.isCompleted = true;

            $scope.currentVideo++;

            if ($scope.currentVideo >= $scope.videos.length) $scope.currentVideo = 0;

            $scope.setVideo($scope.currentVideo);
        };

    }]
);
