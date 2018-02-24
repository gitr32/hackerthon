angular.module('FacebookCtrl', [])
    .controller('FacebookController', ['$scope', '$routeParams', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$mdSidenav', 'facebookService', '$q',function ($scope, $routeParams, $firebaseArray, $firebaseObject, $firebaseAuth, $mdSidenav, facebookService, $q) {
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
      
      $scope.shareURL = 'https://firebasestorage.googleapis.com/v0/b/epayment-f5b97.appspot.com/o/luxury_watch_2.jpg?alt=media&token=3f270a93-eb1e-4a8a-8dd1-b233c8ac3850';

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
    })