/* global moment:false */
(function() {
  'use strict';

  angular
    .module('gong')
    .constant('apiKey', null)
    .constant('clientId', '782299333721-gpi0jl93onskv259h75d1tnfd5qkkr35.apps.googleusercontent.com')
    .constant('applicationId', '-SFhJxgQmttIbbU45EbD-hLZ')
    .constant('scope', ['email', 'profile', 'https://www.googleapis.com/auth/plus.me', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.install'])
    .constant('loadApis', {
      'drive' : 'v2',
      'plus' : 'v1'
    });

})();
