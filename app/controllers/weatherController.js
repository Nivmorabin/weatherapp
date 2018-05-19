angular.module('comeet-test').controller('weatherController', ['$scope', 'weatherService', function ($scope, weatherService) {
    this.searchStarted = false;
    // default is male
    this.gender = "1";
    $scope.loading = false;
    $scope.idealWeatherCandidates = [];

    $scope.$on('idealWeatherCandidatesFound', function (scope, data) {
        for (let candidate in data) {
            $scope.idealWeatherCandidates.push(data[candidate]);
        }
        sortIdealWeatherCandidates();
    });

    $scope.$on('loadingFinished', function () {
        $scope.loading = false;
    });

    this.getIdealWeatherCandidates = function () {
        this.searchStarted = true;
        $scope.loading = true;
        let parsedGender = parseInt(this.gender); // select holds it as a string
        $scope.idealWeatherCandidates = [];
        weatherService.getIdealWeatherCandidates(parsedGender);
    }

    function sortIdealWeatherCandidates() {
        // because our min temp and humidity are the ideal temp and humidity - the less temp and humidity a candidate has is the most ideal
        $scope.idealWeatherCandidates.sort(function (candidate1, candidate2) {
            return candidate1.main.temp - candidate2.main.temp;
        });
    }


    function init() {}

    init();

}]);