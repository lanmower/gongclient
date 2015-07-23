'use strict'
/**
 * Service wrapper for gapi auth functions
 */
angular.module('gong.login').service('login', ['$q', '$mdDialog', '$window', '$routeParams', 'googleApi', 'clientId', 'scope', 'Restangular', function ($q, $mdDialog, $window, $routeParams, googleApi, clientId, scope, Restangular) {
    this.data = {isGuest: true, loggingIn: false};

    /**
     * Check if the current token is valid (exists & not expired.)
     *
     * @return {Boolean} True if token still valid (not expired)
     */
    var isTokenValid = function () {
        var token = gapi.auth.getToken();
        return (token && Date.now() < token.expires_at);
    };

    /**
     * Builds a request object suitable for gapi.auth.authorize calls.
     *
     * @param {Boolean} immediateMode True if auth should be checked silently
     * @param {String} user Optional login hint indiciating which account should be authorized
     * @return {Promise} promise that resolves on completion of the login
     */
    var buildAuthRequest = function (immediateMode, user) {
        var request = {
            client_id: clientId,
            scope: scope,
            immediate: immediateMode
        };
        if (user) {
            request.login_hint = user;
            request.authuser = -1;
        }
        return request;
    };

    /**
     * Attempt authorization.
     *
     * @param {Object} request Auth request
     * @return {Promise} promise that resolves on completion
     */
    var executeRequest = function (request) {
        return googleApi.then(function (gapi) {
            if (isTokenValid()) {
                return gapi.auth.getToken();
            } else {
                var deferred = $q.defer();
                gapi.auth.authorize(request, function (result) {
                    if (result && !result.error) {
                        deferred.resolve(result);
                    } else {
                        var error = result ? result.error : 'Unknown authentication error';
                        deferred.reject(error);
                    }
                });
                return deferred.promise;
            }
        });
    };

    this.logout = function() {
        var self = this;
        self.page = Restangular.one('oauth2', 'logout');
        var deferred = $q.defer();
        self.page.post().then(function(result) {
            self.forgetToken();
            $window.location.hash = '/undefined';
            return deferred.resolve(result);
        }, function(error) {
            return deferred.reject(error);
        });
        return deferred.promise;
    }

    this.forgetToken = function() {
        $window.sessionStorage.token = '';
    }

    this.login = function (model) {
        var deferred = $q.defer();
        var rest = Restangular.one('oauth2');
        model.grant_type = 'password';
        model.client_id = 'testclient';
        model.client_secret = 'testpass';
        model.scope = 'custom';

        rest.post('token', model).then(function (data) {
            deferred.resolve(data.access_token);
            $window.sessionStorage.token = data.access_token;

        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    }

    /**
     * Prompt user for login/authorization
     *
     * @param {String} user Optional login hint indiciating which account should be authorized
     * @return {Promise} promise that resolves on completion of the login
     */
    this.googleLogin = function (user) {
        var request = buildAuthRequest(false, user);
        return executeRequest(request);
    };

    /**
     * Silently check to see if a user has already authorized the app.
     *
     * @param {String} user Optional login hint indiciating which account should be authorized
     * @return {Promise} promise that resolves on completion of the check
     */
    this.checkAuth = function (user) {
        var request = buildAuthRequest(true, user);
        var deferred = $q.defer();
        var self = this;
        //google check
        //console.log('checking google auth');
        //executeRequest(request).then(function() {
        //console.log('google authed');
        //google authed
        //if (self.data.isGuest == true) {
        //    console.log('local not authed');
            //local not authed
        //    if ($window.sessionStorage.token) {
        //        console.log('token found');
                //token found
        //        self.data.isGuest = false;
        //        console.log('authenticated')
        //        deferred.resolve(true);
        //    } else {
        //        console.log('showing login');
        //        self.showLoginDialog(null, $routeParams.user).then(function () {
        //            deferred.resolve(true);
                    //dialog pass
        //        });
        //    }
        //} else {
        //    console.log('local authed');
            //local authed
        //    deferred.resolve(true);
        //}
        //}, function() {
        //    console.log('google not authed');
        //    self.showGoogleDialog(user).then(function() {
        //        console.log('dialaog done');
        //    });

        //});

        return deferred.promise;

    };

    this.hideLoginDialog = function() {
        this.data.loggingIn = false;
        $mdDialog.hide();
    }

    /**
     * Displays a dialog with a login button.
     *
     * @param {Event} $event Optional click event for animations
     * @param {String} user Optional user ID hint if a particular account is required
     */
    this.showLoginDialog = function ($event, user) {
        this.data.loggingIn = true;
        return $mdDialog.show({
            targetEvent: $event,
            templateUrl: "app/components/login/login.html",
            controller: 'LoginCtrl',
            clickOutsideToClose: false,
            escapeToClose: false,
            controllerAs: 'ctrl',
            locals: {
                user: user
            }
        });
    };

    /**
     * Displays a dialog with a login button.
     *
     * @param {Event} $event Optional click event for animations
     * @param {String} user Optional user ID hint if a particular account is required
     */
    this.showGoogleDialog = function ($event, user) {
        return $mdDialog.show({
            targetEvent: $event,
            templateUrl: "app/components/google/google.html",
            controller: 'GoogleCtrl',
            clickOutsideToClose: false,
            escapeToClose: false,
            controllerAs: 'ctrl',
            locals: {
                user: user
            }
        });
    };

}]);
