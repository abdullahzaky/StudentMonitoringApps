//// Student MonitApp for Parent

//angular.module('parentapp', ['ionic', 'parentapp.controllers', 'parentapp.services'])

//.run(function($ionicPlatform) {
//  $ionicPlatform.ready(function() {
//    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//    // for form inputs)
//      if (cordova.platformId === "ios" && window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
//      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//      cordova.plugins.Keyboard.disableScroll(true);
//    }
//    if (window.StatusBar) {
//      // org.apache.cordova.statusbar required
//      StatusBar.styleDefault();
//    }
//  });
//})

//.config(function($stateProvider, $urlRouterProvider) {

//  // Ionic uses AngularUI Router which uses the concept of states
//  // Learn more here: https://github.com/angular-ui/ui-router
//  // Set up the various states which the app can be in.
//  // Each state's controller can be found in controllers.js
//  $stateProvider

//  // setup a login state
//  .state('login', {
//      url: '/login',
//      templateUrl: 'templates/login.html',
//      controller: 'LoginCtrl'
//  })

//  // setup an abstract state for the tabs directive
//    .state('tab', {
//        url: '/tab',
//        abstract: true,
//        templateUrl: 'templates/tabs.html'
//    })

//  // Each tab has its own nav history stack:

//  .state('tab.dash', {
//      url: '/dash',
//      params: {
//          biodataMhs: '',
//          idMahasiswa: '',
//      },
//      views: {
//          'tab-dash': {
//              templateUrl: 'templates/tab-dash.html',
//              controller: 'DashCtrl'
//          }
//      }
//  })

//  .state('tab.nilai', {
//      url: '/nilai',
//      views: {
//          'tab-nilai': {
//              templateUrl: 'templates/tab-nilai.html',
//              controller: 'NilaiCtrl'
//          }
//      }
//  })

//  .state('tab.matakuliah', {
//      url: '/matakuliah',
//      views: {
//          'tab-matakuliah': {
//              templateUrl: 'templates/tab-matakuliah.html',
//              controller: 'MatakuliahCtrl'
//          }
//      }
//  });

//  // if none of the above states are matched, use this as the fallback
//  $urlRouterProvider.otherwise('/login');

//})

//.config(function($httpProvider) {
//    $httpProvider.interceptors.push('httpRequestInterceptor');
//})

//.filter('splitStringWaktu', function ($filter) {
//    return function (string) {
//            var matches = string.split(/[ ]+/g);
//            return matches[0] + ", " + matches[2] + " WIB";
//    }
//})

//.filter('splitStringRuang', function ($filter) {
//    return function (string) {
//        var matches = string.split(/[ ]+/g);
//        return "Ruang " + matches[1];
//    }
//})

//.constant('app', {
//    name: 'Student Monitoring',
//    version: 2.4,
//    url: 'http://localhost:8008/api',
//    id: '8576e44b-1391-4653-af8b-cb4d9db6e086',
//    secretKey: 'Tld11sG+nxCS57d+DP6TeXW6URi1tNd3uRof00RFGW0='
//})

//.value('user', {
//    id: '',
//    nama: '',
//    status: ''
//});

// Student MonitApp for Parent

angular.module('parentapp', ['ionic', 'parentapp.controllers', 'parentapp.services'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
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

.config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

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

    .state('tab2.dash', {
        url: '/dash',
        params: {
            biodataMhs: '',
            idMahasiswa: '',
        },
        views: {
            'tab2-dash': {
                templateUrl: 'templates/tab2-dash.html',
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

    .state('tab2.matakuliah', {
        url: '/matakuliah',
        views: {
            'tab2-matakuliah': {
                templateUrl: 'templates/tab2-matakuliah.html',
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
    version: 2.4,
    url: 'http://localhost:8008/api',
    id: '8576e44b-1391-4653-af8b-cb4d9db6e086',
    secretKey: 'Tld11sG+nxCS57d+DP6TeXW6URi1tNd3uRof00RFGW0='
})

.value('user', {
    id: '',
    nama: '',
    status: ''
});

