angular.module('comeet-test').factory('weatherService', ['$rootScope', '$http', 'countriesService', function ($rootScope, $http, countriesService) {
    const API_URL = "https://api.openweathermap.org/data/2.5/group?id=";
    const APP_ID = "089d311626db6c2ba1c47a63ed1ea8e4";
    const IDEAL_MALE_TEMP = 21;
    const IDEAL_FEMALE_TEMP = 22;
    const IDEAL_HUMIDITY = 50;
    const TEMP_ERROR_FACTOR = 0.2;
    const HUMIDITY_ERROR_FACTOR = 2;
    const FEMALE_TEMP_ADDITION = 1;
    const MIN_HUMIDITY = IDEAL_HUMIDITY;
    const MAX_HUMIDITY = (IDEAL_HUMIDITY + HUMIDITY_ERROR_FACTOR);
    var minTemp = IDEAL_MALE_TEMP;
    var maxTemp = (IDEAL_MALE_TEMP + TEMP_ERROR_FACTOR);


    function getIdealWeatherCandidates(gender = 1) {
        // this can be changed to get more results
        let fromCountyArray = 5000;
        let toCountyArray = 5500;

        // females like one celsius degree more
        minTemp = gender === 1 ? minTemp : (minTemp + FEMALE_TEMP_ADDITION);
        maxTemp = gender === 1 ? maxTemp : (maxTemp + FEMALE_TEMP_ADDITION);

        let countriesArrays = countriesService.getCountriesArrays();
        let responseCount = 0;

        for (let i = fromCountyArray; i < toCountyArray; i++) {
            let countiresIds = countriesArrays[i].join(',');
            $http.get(API_URL + countiresIds + "&units=metric&appid=" + APP_ID)
                .then(weatherResult => {
                    if (weatherResult.status === 200 && weatherResult.data !== null &&
                        weatherResult.data !== undefined) {
                        let weatherCountriesList = weatherResult.data.list;
                        if (weatherCountriesList !== null && weatherCountriesList !== undefined) {
                            let idealWeatherCandidates = weatherCountriesList.filter(country => {
                                return country.main.temp >= minTemp && country.main.temp <= maxTemp &&
                                    country.main.humidity >= MIN_HUMIDITY && country.main.humidity <= MAX_HUMIDITY;
                            });

                            if (idealWeatherCandidates !== null && idealWeatherCandidates !== undefined && idealWeatherCandidates.length > 0) {
                                $rootScope.$broadcast('idealWeatherCandidatesFound', idealWeatherCandidates);
                            }
                        }
                    }
                    responseCount++;
                    if (responseCount === (toCountyArray - fromCountyArray)) {
                        $rootScope.$broadcast('loadingFinished', null);
                    }
                }, err => {
                    responseCount++;
                    if (responseCount === (toCountyArray - fromCountyArray)) {
                        $rootScope.$broadcast('loadingFinished', null);
                    }
                    console.log("Unable to call with countries index: " + i)
                });
        }

    }
    return {
        getIdealWeatherCandidates: getIdealWeatherCandidates,
        getIdealMaleTemperature: IDEAL_MALE_TEMP,
        getIdealFemaleTemperature: IDEAL_FEMALE_TEMP,
        getIdealHumidity: IDEAL_HUMIDITY
    };
}]);