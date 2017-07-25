angular.module('parentapp.services', ['angular.filter', 'ngTable', 'angularMoment'])

.factory('httpRequestInterceptor', function ($location, app) {
  return {
      request: function ($config) {
          if ($config.url.startsWith('http://localhost:8008/api/')) {
              var a = document.createElement('a');
              a.href = $config.url;
              var urlArr = new Array();
              ['href', 'pathname', 'search', 'hash'].forEach(function (k) {
                  urlArr.push(a[k]);
              });
              var url = urlArr[1];
              var query = urlArr[2].slice(1);
              var method = $config.method;
              var timeStamp = moment().format();
              //var timeStamp = (new Date().toUTCString());

              var arr = [method, timeStamp, url, query];
              var message = arr.join("\n");
              var hash = CryptoJS.HmacSHA256(message, app.secretKey);
              var hashInBase64 = hash.toString(CryptoJS.enc.Base64);

              $config.headers["Timestamp"] = timeStamp;
              $config.headers["Authentication"] = app.id + ':' + hashInBase64;
              return $config;
          }
          return $config;
      }
  };
})

.factory('LoginPService', function ($http, user, $location, $window) {
    var isAuthenticated = false;
    var authToken;

    function destroyUserCredentials() {
        authToken = undefined;
        isAuthenticated = false;
    }

    var logout = function () {
        destroyUserCredentials();
        user.id = '';
        user.nama = '';
        user.status = '';
        $location.path("/login");
        $window.location.reload();
        //$route.reload();
    };

    return {
        login: function (nim) {
            return $http.get("http://localhost:8008/api/Mahasiswa/profil/" + nim).then(function (response) {
                user.id = response.data.IdMahasiswa;
                user.nama = response.data.NamaMahasiswa;
                user.status = response.data.StatusMahasiswa;
                isAuthenticated = true;
                return response;
            }
            , function (failure) {
                console.log("failed to login using profil :service", failure);
                return failure;
            });
        },
        logout: logout
    };
})

.factory('MahasiswaPService', function ($http) {
    // Might use a resource here that returns a JSON array
    var summaryMhs = [];
    
    return {
        getSummary: function (id) {
            return $http.get("http://localhost:8008/api/mahasiswa/summary/" + id).then(function (response) {
                summaryMhs = response.data;
                return response.data;
            }
            , function (failure) {
                console.log("failed to get summary :service", failure);
                return failure;
            });
        },

        getKritis: function (id) {
            return $http.get("http://localhost:8008/api/mahasiswa/kritisakhir/" + id).then(function (response) {
                return response;
            }
            , function (failure) {
                console.log("failed to find kritis /kritis dua :service", failure);
                //failure.status = 401 means unauthorized token provided.
                return failure;
            });
        },
        getKritisDua: function (id) {
            return $http.get("http://localhost:8008/api/mahasiswa/kritisdua/" + id).then(function (response) {
                return response;
            }
            , function (failure) {
                console.log("failed to find kritis /kritis dua :service", failure);
                //failure.status = 401 means unauthorized token provided.
                return failure;
            });
        },

        getProfil: function (id){
            return $http.get("http://localhost:8008/api/Mahasiswa/profil/" + id).then(function (response) {
                return response.data;
            }
            , function (failure) {
                console.log("failed to find profil :service", failure);
                //failure.status = 401 means unauthorized token provided.
                return failure;
            });
        },

        useSummary: function () {
            return summaryMhs;
        }
    };
})

.factory('NilaiPService', function ($http) {
    return {
        getNilaiMahasiswa: function (id) {
            return $http.get('http://localhost:8008/api/mahasiswa/nilai/' + id).then(function (response) {
                return response.data;
            }
            , function (failure) {
                console.log("failed get makul nilai :service", failure);
                return failure
            });
        },

        getNilaiPraktikum: function (id) {
            return $http.get('http://localhost:8008/api/mahasiswa/nilai/praktikum/' + id).then(function (response) {
                return response.data;
            }
            , function (failure) {
                console.log("failed get makul nilai praktikum :service", failure);
                return failure
            });
        }
    };
})

.factory('MakulPService', function ($http, $filter) {
    function splitSpace(string, stringArray) {
        string = string.split(" ");
        var stringArray = new Array();
        for (var i = 0; i < string.length; i++) {
            stringArray.push(string[i]);

        }
    }
    function arrayConverter(inputObj, output) {
        for (var key in inputObj) {
            // must create a temp object to set the key using a variable
            var tempObj = {};
            tempObj[key] = inputObj[key];
            output.push(tempObj);
        }
    }

    return {
        getJadwal: function (id) {
            return $http.get("http://localhost:8008/api/Makul/jadwal/" + id).then(function (response) {
                return response.data;
            }
            , function (failure) {
                console.log("failed get makul nilai :service", failure);
                return failure
            });
        },

        getAllMakul: function () {
            return $http.get("http://localhost:8008/api/Makul/").then(function (response) {
                return response.data;
            }
            , function (failure) {
                console.log("failed get makul nilai :service", failure);
                return failure
            });
        },

        getMakulTertinggal: function (id) {
            return $http.get('http://localhost:8008/api/makul/tertinggal/' + id).then(function (response) {
                return response.data;
            }
            , function (failure) {
                console.log("failed get makul nilai :service", failure);
                return failure
            });
        }
    };
});