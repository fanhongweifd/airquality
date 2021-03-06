/**
 * @ngdoc function
 * @name AQ.controller:LoginController
 * @requires factories/AQ.factory:data
 * @requires factories/AQ.factory:viewport
 * @requires factories/AQ.factory:state
 * @requires factories/AQ.factory:oauth
 * @requires factories/AQ.factory:helpers
 *
 * @description
 * Controller for the Login state.
 */
AQ.controller('LoginController', function ($window, $scope, data, viewport, state, oauth, helpers) {
  'use strict';

  state.setTitle('Log in');

  // Redirect to Index state when user is already authenticated
  if (!_.isEmpty(data.authentication)) {
    state.redirect('index');
  }

  $scope.authentication = {};

  /**
   * @ngdoc method
   * @name AQ.controller:LoginController#authenticate
   * @methodOf AQ.controller:LoginController
   *
   * @description
   * Authenticates user.
   */
  $scope.authenticate = function () {
    var email = $scope.authentication.email;
    var password = $scope.authentication.password;

    $scope.authentication.error = {};

    if (!email || !_.isString(email) || !helpers.checkEmail(email)) {
      $scope.authentication.error.email = true;
    }

    if (!password || !_.isString(password)) {
      $scope.authentication.error.password = true;
    }

    if (_.isEmpty($scope.authentication.error)) {
      oauth.authenticate(email, password).then(
        function () {
          state.redirect();
        },
        function () {
          $scope.authentication.error.api = true;

          $window.navigator.notification.alert(
            'There was a problem logging you in, maybe your email or password is incorrect?',
            undefined,
            'Error',
            'OK'
          );
        }
      );
    }
  };
});
