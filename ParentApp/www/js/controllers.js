angular.module('parentapp.controllers', ['ngTable', 'angular.filter', 'chart.js'])

.controller('LoginPCtrl', function ($scope, $ionicLoading, $state, $ionicPopup, LoginPService) {
    $scope.data = {};

    function showPopup(message) {
        var alertPopup = $ionicPopup.alert({
            title: 'Login Failed',
            template: message
        })
    };

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
                    $state.go('tab2.dash', { idMahasiswa: response.data.IdMahasiswa, biodataMhs: response.data });
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

});