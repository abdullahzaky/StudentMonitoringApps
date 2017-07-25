angular.module('starter.services', ['angular.filter', 'ngResource', 'ngTable', 'angularMoment'])

.factory('httpRequestInterceptor', function ($location, $q, $window, app) {
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
        //responseError: function (rejection) {
        //    if (rejection.config.url.startsWith('http://localhost:8008/api/')) {
        //        if (rejection.status === 401) {
        //            $location.path("/login");
        //            $window.location.reload();
        //        }
        //        return $q.reject(rejection);
        //    }
        //    return response;
        //}
    };
})


//Parent App-----------------------------------------------------------------------
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
        $location.path("/login-parent");
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
})


//Pengelola App-------------------------------------------------------------------------
.factory('AuthService', function ($resource, $http, $location, user, $window) {
    //var LOCAL_TOKEN_KEY = 'yourTokenKey';
    var isAuthenticated = false;
    //var authToken;

    function checkCredentials() {
    }

    function useCredentials(token) {
        isAuthenticated = true;
        user.authToken = token;
        user.tokenExpire = Date.now() / 1000;

        // Set the token as header for your requests!
        $http.defaults.headers.common['Token'] = user.authToken;
    }

    function destroyUserCredentials() {
        user.authToken = '';
        isAuthenticated = false;
        $http.defaults.headers.common['Token'] = undefined;
        $location.path("/login");
        $window.location.reload();
    }

    function login (encodedAuth) {
        var queryLogin = $resource('http://localhost:8008/api/Authenticate/:id', { id: '@id' }, {
            post: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + encodedAuth
                },
                transformResponse: function (data, headers) {
                    response = {};
                    response.data = data;
                    response.headers = headers();
                    return response;
                }
            }
        });
        return queryLogin;
    };

    var logout = function () {
        return $http.delete("http://localhost:8008/api/Authenticate").then(function (response) {
            destroyUserCredentials();
            return response
        }
        , function (failure) {
            console.log("failed to logout :service", failure);
            return failure
        });
    };

    return {
        login: login,
        logout: logout,
        useCredentials: useCredentials
    }; 
})

.factory('MahasiswaService', function ($http, app) {
    // Might use a resource here that returns a JSON array
    var mahasiswa = [];
    var nilaiMahasiswa = [];
    var makul = [];

    function equijoin(primary, foreign, primaryKey, foreignKey, select) {
        var m = primary.length, n = foreign.length, index = [], c = [];

        for (var i = 0; i < m; i++) {     // loop through m items
            var row = primary[i];
            index[row[primaryKey]] = row; // create an index for primary table
        }

        for (var j = 0; j < n; j++) {     // loop through n items
            var y = foreign[j];
            var x = index[y[foreignKey]]; // get corresponding row from primary
            c.push(select(x, y));
        }
        return c;
    }

    return {
    getKritisDua: function (param) {
        return $http.get("http://localhost:8008/api/mahasiswa/kritisdua" + (param || "")).then(function (response) {
            return response.data;
        }
        , function (failure) {
            console.log("failed to find kritis / kritis dua :service", failure);
        });
    },
    getKritis: function (param) {
        return $http.get("http://localhost:8008/api/mahasiswa/kritisakhir" + (param || "")).then(function (response) {
            return response.data;
        }
        , function (failure) {
            console.log("failed to find kritis / kritis dua :service", failure);
        });
    },

    getProfil: function () {
        return $http.get("http://localhost:8008/api/mahasiswa/profil?$orderby=StatusMahasiswa")
        .then(function (response) {
            return response.data;
        }
        , function (failure) {
            console.log("failed to get profil :service", failure);
        });
    },

    findAProfil: function (id) {
        return $http.get("http://localhost:8008/api/mahasiswa/profil/" + id)
        .then(function (response) {
            return response.data;
        }
        , function (failure) {
            console.log("failed to get profil :service", failure);
        });
    },

    allSummary: function (url) {
        return $http.get(url)
        .then(function (response) {
            mahasiswa = response.data;
            return mahasiswa
        }
        , function (failure) {
            console.log("failed to get all summary :service", failure);
            return failure
        });
    },

    getSummary: function (mahasiswaId) {
      for (var i = 0; i < mahasiswa.length; i++) {
          if (mahasiswa[i].IdMahasiswa === parseInt(mahasiswaId)) {
              console.log(mahasiswa[i]);
            return mahasiswa[i];
        }
      }
      return null;
    },

    getNilaiMahasiswa: function(id, periode){
        return $http.get('http://localhost:8008/api/mahasiswa/nilai?nim=' + (id || "") + "&periode=" + (periode || "")).then(function (response) {
            console.log(JSON.stringify(response));
            nilaiMahasiswa = response.data;
            return nilaiMahasiswa;
        }
        , function (failure) {
            console.log("failed get makul nilai :service", failure);
            return failure
        });
    },

    getMakulTertinggal: function(id){
        return $http.get('http://localhost:8008/api/makul/tertinggal/' + (id)).then(function (response) {
            console.log(JSON.stringify(response));
            makul = response.data;
            return makul;
        }
        , function (failure) {
            console.log("failed get makul nilai :service", failure);
            return failure
        });
    }
  };
})

.factory('ChartService', function ($http, $filter, MahasiswaService) {
    var profil = [];

    var getData = function (url) {
        var data = "";
        var deferred = $q.defer();

        $http.get(url)
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (errResp) {
                deferred.reject({ message: "Really bad" });
            });
        return deferred.promise;
    }

    function arrayConverter(inputObj, output) {
        for (var key in inputObj) {
            // must create a temp object to set the key using a variable
            var tempObj = {};
            tempObj[key] = inputObj[key];
            output.push(tempObj);
        }
    }

    function arrayUniqueCounter(array_elements, value, data) {
        array_elements.sort();
        var cnt = 0;
        var current = null
        for (i = 0; i < array_elements.length; i++) {
            if (array_elements[i] != current) {
                if (cnt > 0) {
                    value.push('Semester ' + current);
                    data.push(cnt);
                }
                current = array_elements[i];
                cnt = 1;
            } else {
                cnt++;
            }
        }
    }

    return {
        getPieData: function (profil) {
            //var profil = MahasiswaService.getProfil();
            //profil.then(function (response) {
            var nama = ($filter('groupBy')(profil, 'StatusMahasiswa'));
            //arrayConverter(Object.keys(nama), groupStatMhs)
            var groupStatMhs = [];
            var countStatMhs = [];
            for (j = 0; j < Object.keys(nama).length; j++) {
                var data = $filter('filter')(profil, { 'StatusMahasiswa': Object.keys(nama)[j] }).length;
                countStatMhs.push(data);
                groupStatMhs.push(Object.keys(nama)[j]);
            }
            return { nama: groupStatMhs, value: countStatMhs };
        },

        getBarData: function () {
            return $http.get('http://localhost:8008/api/makul/tertinggal').then(function (response) {
                var allMakul = [];
                var semester = [];
                var count = [];
                for (var key in response.data) {
                    for (var index in response.data[key].Makul) {
                        allMakul.push(response.data[key].Makul[index].RekomendasiPengambilan);
                    }
                }
                arrayUniqueCounter(allMakul, semester, count)
                return { nama: semester, value: count };
            }, function (failure) {
                console.log("failed get diagram data bar makul tertinggal :service", failure);
                return failure;
            });
        }
    };
})

.factory('MakulService', function ($http, $filter) {

    return {
        getAllMakul: function () {
            return $http.get("http://localhost:8008/api/makul")
            .then(function (response) {
                return response;
            }
            , function (failure) {
                console.log("failed to get all summary :service", failure);
            });
        },
        getNilaiMakul: function (id, periode) {
            return $http.get("http://localhost:8008/api/makul/nilai/" + id + "?periode=" + (periode || ""))
            .then(function (response) {
                return response.data;
            }
            , function (failure) {
                console.log("failed to get all summary :service", failure);
            });
        },
        getPeriode: function () {
            return $http.get("http://localhost:8008/api/makul/periode").then(function (response) {
                return response.data;
            },  function (failure) {
                console.log("failed to get all summary :service", failure);
            });
        },
        getAllJadwal: function(){
            return $http.get("http://localhost:8008/api/makul/jadwal").then(function(response){
                return response.data;
            },  function (failure) {
                console.log("failed to get all summary :service", failure);
            });
        }
    };
});