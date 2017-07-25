angular.module('starter.controllers', ['ngTable', 'angular.filter', 'chart.js'])

//Parent App Controller----------------------------------------------------------------------------
.controller('LoginPCtrl', function ($scope, $ionicLoading, $state, $ionicPopup, LoginPService) {
    $scope.data = {};

    function showPopup(message) {
        var alertPopup = $ionicPopup.alert({
            title: 'Login Failed',
            template: message
        })
    };

    $scope.asPengelola = function () {
        $state.go('login');
    }

    $scope.loginParent = function (data) {
        var RegExp = /^[0-9]{4,6}/;
        var match = RegExp.exec(data);
        if (match == "undefined" || match == null) {
            showPopup('Mohon isikan nomor mahasiswa dengan benar');
        }
        else {
            LoginPService.login(data).then(function (response) {
                if (response.status == '404') {
                    showPopup('Nomor mahasiswa tidak terdaftar');
                }
                else if (response.status == '500') {
                    showPopup('Server sedang dalam gangguan')
                }
                else if (response.status == '200') {
                    $state.go('tab2.parent', { idMahasiswa: response.data.IdMahasiswa, biodataMhs: response.data });
                }
            }, function (error) { console.log('Cant login right now :Ctrl', error); }
            );
        }
    };

    $scope.showLoading = function () {
        $ionicLoading.show({
            template: 'Loading...',
            duration: 2000
        })
    };
})

.controller('DashPCtrl', function ($scope, $http, $ionicLoading, $state, $ionicModal, user, MahasiswaPService, LoginPService, NilaiPService, MakulPService) {
    //$ionicLoading.show({
    //    template: '<ion-spinner icon="spiral" class="spinner-positive"></ion-spinner> <br>Loading...',
    //    animation: 'fade-in'
    //});
    $scope.biodata = $state.params.biodataMhs;
    
    $scope.logoutParent = function () {
        LoginPService.logout();
        console.log('Logout Success');
    }

    MahasiswaPService.getSummary(user.id).then(function (data) {
        $scope.mahasiswa = data;
        var value_ips = [];
        var value_sks = [];
        var periode = [];
        var data = data.EnrollIps
        for (var key in data) {
            value_ips.push(data[key].Ips);
            value_sks.push(data[key].Sks);
            periode.push(data[key].PeriodeEnroll);
        }
        return $scope.labels_period = periode,
            $scope.data_sks = value_sks,
            $scope.data_ips = value_ips,
            $scope.max_ips = Math.max.apply(Math, value_ips.map(function (item) { return item; }));
    },
    function (error) {
        console.log("Failed to get summary mahasiswa :Ctrl", error);
    });

    //chart data
    //MahasiswaPService.getLinePeriod(user.id).then(function (response) {
    //    return $scope.labels_period = response.nama,
    //        $scope.data_sks = response.sks,
    //        $scope.data_ips = response.ips;
    //});

    $scope.show_kritis = false;
    MahasiswaPService.getKritis(user.id).then(function (response) {
        var data = response;
        if (data.status == "200") {
            $scope.show_kritis = true;
            return $scope.model_kritis = data.data
        }
        return console.log("Mahasiswa as kritis not found :Ctrl")
    }, function (error) { console.log('Errror :(', error) });

    MahasiswaPService.getKritisDua(user.id).then(function (response) {
        var data = response;
        if (data.status == "200") {
            $scope.show_kritis = true;
            return $scope.model_kritis = data.data
        }
        return console.log("Mahasiswa as kritis not found :Ctrl")
    }, function (error) { console.log('Errror :(', error) });

    NilaiPService.getNilaiPraktikum(user.id).then(function (dataPrakt) {
        MakulPService.getAllMakul().then(function (data) {
            var dataMakul = [];
            for (var row in data) {
                if (data[row].RekomendasiPengambilan <= $state.params.biodataMhs.Semester && data[row].NamaMakul.indexOf('Prakt.') != -1) {
                    dataMakul.push(data[row]);
                }
            }
            //console.log(dataMakul.filter(a1 => dataPrakt.map(a2 => a2.IdMakul).indexOf(a1.IdMakul) < 0));
            return $scope.filtered_prakt = dataMakul.filter(a1 => dataPrakt.map(a2 => a2.KodeMakul).indexOf(a1.KodeMakul) < 0)
        }, function (error) { console.log('Errror :(', error) });
        return $scope.makul_praktikum = dataPrakt;
    }, function (error) { console.log('Errror :(', error) });

    NilaiPService.getNilaiMahasiswa(user.id).then(function (nilai_mhs) {
        $scope.CountKerjaPraktik = false;
        $scope.CountKKN = false;
        $scope.CountSkripsi = false;
        for (i = 0; i < nilai_mhs.length; i++) {
            if (nilai_mhs[i].NamaMakul == "Kerja Praktik") {
                $scope.CountKerjaPraktik = true;
            }
            else if (nilai_mhs[i].NamaMakul == "KKN") {
                $scope.CountKKN = true;
            }
            else if (nilai_mhs[i].NamaMakul == "Skripsi") {
                $scope.CountSkripsi = true;
            }
        }
        return $scope.nilai_mhs = nilai_mhs;
    }, function (error) { console.log('Errror :(', error) });

    $ionicModal.fromTemplateUrl('templates/mahasiswa-profil.html', {
        scope: $scope,
        animation: 'slide-in-up',
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function (data) {
        $scope.biodata = data;
        $scope.modal.show();
    };

    $scope.closeModal = function () {
        $scope.modal.hide();
    };
    $scope.datasetOverride = [{
        fill: false
    }];
    $scope.options = {
        scales: {
            yAxes: [
              {
                  id: 'y-axis-1',
                  type: 'linear',
                  display: true,
                  position: 'left'
              }
            ]
        }
    };
})

.controller('NilaiPCtrl', function ($scope, NilaiPService, MakulPService, MahasiswaPService, user) {

    $scope.mhs_summary = MahasiswaPService.useSummary();

    NilaiPService.getNilaiMahasiswa(user.id).then(function (nilaiMahasiswa) {
        return $scope.all_nilai = nilaiMahasiswa;
    }, function (error) { console.log('Errror :(', error) });

    //MakulPService.getMakulTertinggal(user.id).then(function (makul) {
    //    return $scope.makul_tertinggal = makul;
    //}, function (error) { console.log('Errror :(', error) });

    //$scope.getNilai = function (x) {
    //    $scope.searchText = x;
    //}
})

.controller('MatakuliahPCtrl', function ($scope, MakulPService, user) {

    MakulPService.getJadwal(user.id).then(function (makul_jadwal) {
        return $scope.jadwal_mahasiswa = makul_jadwal;
    }, function (error) { console.log('Errror :(', error) });

    MakulPService.getMakulTertinggal(user.id).then(function (makul_tertinggal) {
        return $scope.makul_tertinggal = makul_tertinggal;
    }, function (error) { console.log('Errror :(', error) });

})


//Pengelola App Controller----------------------------------------------------------------------------
.controller('LoginCtrl', function ($scope, $ionicLoading, $state, $ionicPopup, $location, AuthService, $q) {
    function showPopup(title, message) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: message
        })
    };

    $scope.data = {};

    $scope.asOrangTua = function () {
        $state.go('login-parent');
    }

    $scope.doLogin = function (data) {
        var authToken;
        encodedAuthString = btoa(data.username + ":" + data.password);
        console.log(encodedAuthString);
        AuthService.login(encodedAuthString).post({},
            function success(response) {
                console.log(response.data);
                console.log(response.headers['date']);
                if (response.headers['token']) {
                    AuthService.useCredentials(response.headers['token']);
                }
                $state.go('tab.dash');
            },
            function err(response) {
                if (response.status == 500) {
                    showPopup('Login Gagal', response.statusText + ' Mohon tunggu sejenak hingga server pulih.');
                }
                console.log('Error');
                showPopup('Login Gagal', 'Mohon cek kembali password atau username yang anda masukkan.');
            });
    };

    $scope.doLogout = function () {
        AuthService.logout();
        console.log('Logout Success');
        $location.path('/login');
    }

    $scope.showLoading = function () {
        $ionicLoading.show({
            template: 'Loading...',
            duration: 2000
        })
    };

    $scope.changePage = function () {
        $state.go('tab.dash', { movieid: 1 });
    };
})

.controller('DashCtrl', function ($scope, $http, ChartService, MahasiswaService, AuthService, app, filterFilter) {
    //$ionicLoading.show({
    //    template: '<ion-spinner icon="spiral" class="spinner-positive"></ion-spinner> <br>Loading...',
    //    noBackdrop: true,
    //    animation: 'fade-in'
    //});

    $scope.logoutParent = function () {
        AuthService.logout().then(function (response){
            console.log(response.status + response.statusText);
        },
        function (failure) { console.log("Failed to logout :ctrl", failure) });
    }

    var dataPie;
    $scope.angkatan_mhs = '2010';
    //$http.defaults.headers.common['Token'] = '84042b66-f1b2-4185-90b1-7899bd5dfce5';
    var urlProfil = "http://localhost:8008/api/mahasiswa/profil";
    var urlKritis = "http://localhost:8008/api/mahasiswa/kritisakhir";
    var urlKritisDua = "http://localhost:8008/api/mahasiswa/kritisdua";


    $scope.pickAngkatan = function (angkatan_mhs) {
        MahasiswaService.getProfil().then(function (profil) {
            //$ionicLoading.hide();
            $scope.profilMhs = profil;
            var filteredProfil = filterFilter($scope.profilMhs, { Angkatan: angkatan_mhs });
            dataPie = ChartService.getPieData(filteredProfil);
            $scope.labelspie = dataPie.nama;
            $scope.datapie = dataPie.value;
            return $scope.profilMhs;
        }, function (failure) { console.log("Failed to get all profil :ctrl", failure) });
    }

    MahasiswaService.getKritis().then(function (response) {
        return $scope.kritisAkhir = response;
    }, function (failure) { console.log("Failed to get all kritis :ctrl", failure) });

    MahasiswaService.getKritisDua().then(function (response) {
        return $scope.kritisDua = response;
    }, function (failure) { console.log("Failed to get all kritis dua :ctrl", failure) });

    //filter to outpug ng-repeat
    $scope.filterTotalMhs = function (profil) {
        return profil.StatusMahasiswa !== "Lulus" && profil.StatusMahasiswa !== "Drop Out";
    }
    $scope.filterMhsLolos = function (profil) {
        return profil.Kelolosan !== false;
    }

    ChartService.getBarData().then(function (response) {
        return $scope.labelsbar = response.nama,
            $scope.databar = response.value
    })

})

.controller('MahasiswaCtrl', function ($scope, $http, $ionicPopup, NgTableParams, MahasiswaService) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
    function showPopup(message) {
        var alertPopup = $ionicPopup.alert({
            title: 'Pencarian Tidak Berhasil',
            template: message
        })
    };

    $scope.options = [
    { name: 'Ringkasan',
      value: 'all'},
    { name: 'Kritis Akhir',
      value: 'kritis'},
    { name: 'Kritis Dua Tahun',
      value: 'kritis-dua' },
    ];

    $scope.myChosenFilter = $scope.options[0].value;

    $scope.filter = { angkatan: '', sks: '', ipk: '', kelolosan:'', semester:'' };
    $scope.filter.sks = { tinggi: '', rendah: '' };
    $scope.filter.ipk = { tinggi: '', rendah: '' };


    $scope.selectFilter = function (myChosenFilter, filter) {
        if (myChosenFilter == 'all') {
            var url = "http://localhost:8008/api/mahasiswa/summary/?angkatan=" + (filter.angkatan || "") + "&ipkTerendah=" + (filter.ipk.rendah || "")
                + "&ipkTertinggi=" + (filter.ipk.tinggi || "") + "&sksTerendah=" + (filter.sks.rendah || "") + "&sksTertinggi=" + (filter.sks.tinggi || "");

            MahasiswaService.allSummary(url).then(function (mahasiswa) {
                if (mahasiswa.status == 500 || mahasiswa.length == 0) {
                    showPopup("Pencarian tidak berhasil menemukan mahasiswa dengan kriteria tersebut.")
                }
                return $scope.tableParams = new NgTableParams({}, { dataset: mahasiswa })
            }, function (failure) {
                if (failure) {
                    showPopup("Mohon lakukan pengecekan pada koneksi anda.")
                }
                console.log("failed to find summary param :ctrl", failure);
            });
        }
        else if (myChosenFilter == 'kritis') {            
            var param = "?angkatan=" + (filter.angkatan || "") + "&ipkTerendah=" + (filter.ipk.rendah || "") + "&ipkTertinggi=" + (filter.ipk.tinggi || "")
                + "&kelolosan=" + (filter.kelolosan || "") + "&sksTerendah=" + (filter.sks.rendah || "") + "&sksTertinggi=" + (filter.sks.tinggi || "");

            MahasiswaService.getKritis(param).then(function (mahasiswa) {
                if (mahasiswa.status == 500 || mahasiswa.length == 0) {
                    showPopup("Mahasiswa kritis "+filter.angkatan+" tidak ditemukan.")
                }
                return $scope.tableParams = new NgTableParams({}, { dataset: mahasiswa })
            },
            function (failure) {
                if (failure) {
                    showPopup("Mohon lakukan pengecekan pada koneksi anda.")
                }
                console.log("failed to find kritis akhir :ctrl", failure);
            });
        }

        else if (myChosenFilter == 'kritis-dua') {
            var param = "?angkatan=" + (filter.angkatan || "") + "&kelolosan=" + (filter.kelolosan || "");

            MahasiswaService.getKritisDua(param).then(function (mahasiswa) {
                if (mahasiswa.status == 500 || mahasiswa.length == 0) {
                    showPopup("Pencarian mahasiswa kritis pada dua tahun pertama tidak ditemukan.")
                }
                return $scope.tableParams = new NgTableParams({}, { dataset: mahasiswa })
            }
            , function (failure) {
                if (failure) {
                    showPopup("Mohon lakukan pengecekan pada koneksi anda.")
                }
                console.log("failed to find kritis dua :ctrl", failure);
            });
        }
    }
})

.controller('MahasiswaDetailCtrl', function ($scope, $state, $ionicModal, $stateParams, MahasiswaService) {
    var idMhs = $stateParams.mahasiswaId;
    ``
    $scope.mahasiswa = MahasiswaService.getSummary($stateParams.mahasiswaId);

    MahasiswaService.getNilaiMahasiswa($stateParams.mahasiswaId).then(function (nilaiMahasiswa) {
        return $scope.nilai = nilaiMahasiswa;
    }, function (error) { console.log('Errror :(', error) });

    MahasiswaService.getMakulTertinggal($stateParams.mahasiswaId).then(function (makul) {
        return $scope.makulTertinggal = makul;
    }, function (error) { console.log('Errror :(', error) });

    MahasiswaService.findAProfil($stateParams.mahasiswaId).then(function (response) {
        return $scope.biodata = response;
    }, function (error) { console.log('Failed to get profil mahasiswa :Ctrl', error); return error; });

    $ionicModal.fromTemplateUrl('templates/mahasiswa-profil.html', {
        scope: $scope,
        animation: 'slide-in-up',
    }).then(function (modal, biodata) {
        //$scope.biodata = biodata;
        $scope.modal = modal;
    });

    $scope.openModal = function (biodata) {
        $scope.biodata = biodata;
        $scope.modal.show();
    };

    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    // $scope.gotoProfil = function (id) {
    //     $state.go('tab.mahasiswa-profil', {id:$stateParams.mahasiswaId});
    // }

    //$scope.nilai = Mahasiswa.getMakulNilai()
})

// .controller('MahasiswaProfilCtrl', function ($scope, $stateParams, MahasiswaService) {
//     var urlProfil = "http://localhost:8008/api/mahasiswa/profil/" + $stateParams.id;
//     MahasiswaService.getProfil(urlProfil).then(function (profil) {
//         return $scope.biodata = profil;
//     }, function (error) { console.log('Errror :(', error) });
// })

.controller('MatakuliahCtrl', function ($scope, NgTableParams, MakulService) {
    var makul = [];
    //var periode = '2015-2';
    $scope.option_makul = [];
    $scope.emptyOrNull = function (item) {
        return !(item.Jadwal === null || item.Jadwal.trim().length === 0)
    }

    MakulService.getAllMakul().then(function (response) {
        makul = response.data;
        //for (i = 0; i < makul.length; i++) {
        //    $scope.option_makul.push({ name: makul[i].NamaMakul, value: makul[i].IdMakul })
        //}
        return $scope.makul = makul;
    }, function (error) {
        console.log('Makul failed to query all makul :Ctrl')
    });

    MakulService.getAllJadwal().then(function (data) {
        return $scope.all_jadwal = data,
            $scope.tableParams = new NgTableParams({}, { dataset: data });
    }, function (error) {
        console.log('Makul failed to query all makul :Ctrl')
    });

    $scope.selectNilai = function (option) {
        MakulService.getPeriode().then(function (data) {
            periode = data[data.length - 1];
            MakulService.getNilaiMakul(option, periode).then(function (response) {
                return $scope.nilai_makul = response;
            }, function (error) {
                console.log('Makul failed to query nilai makul :Ctrl')
            });
            return;
        });
    }

    //MakulService.getAllMakul().then(function (response) {
    //    return $scope.makul = response;
    //}, function (error) {
    //    console.log('Makul failed to query jadwal aktif :Ctrl')
    //});

    //var urlMakul = "http://localhost:8008/api/makul?dosen=" + (dosen || "") + "&sifat=" + (sifat || "") + "&rekomendasi=" + (rekomendasi || "");


});