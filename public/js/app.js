angular.module('VAProject', ['ngRoute', 'appRoutes', 'ngMaterial', 'ngMdIcons', 'ngWebSocket', 'appDirective', 'MainCtrl', 'DashboardCtrl', 'DashboardService', 'DashboardDirective', 'firebase','CheckoutCtrl','ConfirmCtrl','SelectedItemCtrl', 'FacebookCtrl', 'CartCtrl', 'ShippingCtrl', 'RaidParticipationCtrl'])
.controller('AppController', ['$scope', '$routeParams', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$mdSidenav', 'facebookService', '$q',function ($scope, $routeParams, $firebaseArray, $firebaseObject, $firebaseAuth, $mdSidenav, facebookService, $q) {
  window.fbAsyncInit = function() {
    FB.init({
      appId            : '198059907448254',
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v2.12'
    });
  };
  
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
  
  $scope.shareURL = 'https://www.facebook.com/keefe21';

  $scope.checkFacebookLogin = function() {
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        fetchUserDetail();
      } 
      else 
      {
        initiateFBLogin();
      }
      });
  }

  function initiateFBLogin () {
    FB.login(function(response) {
        console.log(response);
        
        facebookService.setAccessToken(response.authResponse.accessToken);
        
        fetchUserDetail();
    }, {scope: 'public_profile,email'});
  }

  $scope.accessTokenExists = function () {
    if (facebookService.getAccessToken() !== '') {
      return true;
    }

    return false;
  }

  function fetchUserDetail() {
    FB.api('/me', function(response) {
        console.log('FETCHING USER DETAILS');
        console.log(response);
        console.log(facebookService.getAccessToken());
    });
  }
  
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }
  
  
}])
.service('facebookService', function () {
  var facebookAccessToken = '';

  return {
    getAccessToken: function() {
      return facebookAccessToken;
    },
    setAccessToken: function(token) {
      facebookAccessToken = token;
    }
  }
});