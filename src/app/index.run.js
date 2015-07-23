(function () {
    'use strict';

    var app =
    angular
        .module('gong');
    app
        .run(runBlock);

    /** @ngInject */
    function runBlock($log, $http) {

        //$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        $http.defaults.headers.post['X-CSRF-Token'] = $('meta[name="csrf-token"]').attr("content");

        $log.debug('runBlock end');
    }

})();
