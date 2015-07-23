/**
 * This directive will find itself inside HTML as a class,
 * and will remove that class, so CSS will remove loading image and show app content.
 * It is also responsible for showing/hiding login form.
 */
angular.module('gong.login').directive('gongAuth', ['login', 'authService', function(loginService, authService) {
    return {
        restrict: 'C',
        link: function(scope, elem, attrs) {
            //once Angular is started, remove class:
            elem.removeClass('waiting-for-angular');

            var loading = elem.find('.loading');

            loading.hide();

            scope.$on('event:auth-loginRequired', function() {
                loginService.showLoginDialog();
            });
            scope.$on('event:auth-loginConfirmed', function() {
                loginService.hideLoginDialog();
            });
        }
    }
}]);
