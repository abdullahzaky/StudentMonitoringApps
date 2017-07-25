// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
      if (cordova.platformId === "ios" && window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup a login state
    .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
    })

    // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
    url: '/dash',
    views: {
        'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
        }
    }
    })

    .state('tab.mahasiswa', {
        url: '/mahasiswa',
        views: {
        'tab-mahasiswa': {
            templateUrl: 'templates/tab-mahasiswa.html',
            controller: 'MahasiswaCtrl'
        }
        }
    })
    .state('tab.mahasiswa-detail', {
        url: '/mahasiswa/:mahasiswaId',
        views: {
        'tab-mahasiswa': {
            templateUrl: 'templates/mahasiswa-detail.html',
            controller: 'MahasiswaDetailCtrl'
        }
        }
    })

    .state('tab.matakuliah', {
    url: '/matakuliah',
    views: {
        'tab-matakuliah': {
        templateUrl: 'templates/tab-matakuliah.html',
        controller: 'MatakuliahCtrl'
        }
    }
    })

    // setup a login state
    .state('login-parent', {
        url: '/login-parent',
        templateUrl: 'templates/login-parent.html',
        controller: 'LoginPCtrl'
    })

    // setup an abstract state for the tabs directive
        .state('tab2', {
            url: '/tab2',
            abstract: true,
            templateUrl: 'templates/tabs2.html'
        })

    // Each tab has its own nav history stack:
    .state('tab2.parent', {
        url: '/parent',
        params: {
            biodataMhs: '',
            idMahasiswa: '',
        },
        views: {
            'tab2-parent': {
                templateUrl: 'templates/tab2-parent.html',
                controller: 'DashPCtrl'
            }
        }
    })

    .state('tab2.nilai', {
        url: '/nilai',
        views: {
            'tab2-nilai': {
                templateUrl: 'templates/tab2-nilai.html',
                controller: 'NilaiPCtrl'
            }
        }
    })

    .state('tab2.makul', {
        url: '/makul',
        views: {
            'tab2-makul': {
                templateUrl: 'templates/tab2-makul.html',
                controller: 'MatakuliahPCtrl'
            }
        }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login-parent');
})

.config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
})

.filter('splitStringWaktu', function ($filter) {
    return function (string) {
        var matches = string.split(/[ ]+/g);
        return matches[0] + ", " + matches[2] + " WIB";
    }
})

.filter('splitStringRuang', function ($filter) {
    return function (string) {
        var matches = string.split(/[ ]+/g);
        return "Ruang " + matches[1];
    }
})

.constant('app', {
    name: 'Student Monitoring',
    version: 1.2,
    url: 'http://localhost:8008/api',
    id: '8576e44b-1391-4653-af8b-cb4d9db6e086',
    secretKey: 'Tld11sG+nxCS57d+DP6TeXW6URi1tNd3uRof00RFGW0='
})

.value('user', {
    id: '',
    authToken: '',
    tokenExpire: ''
});