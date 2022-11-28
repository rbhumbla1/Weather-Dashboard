var mainEl = $('#main-area');
var cityEl = $('#searchCity');
var searchBtnEl = $('#searchButton');
var savedSearchEl = $('#savedSearch');
var todayEl = $('#today');
var curCity = "";
var savedCities = [];
var apiKey = "b0bb308922887642a5d7fe5054695311";
var coords = {
    lat: 0.0000,
    lon: 0.0000
}
var line1 = "";
var line2 = "";
var line3 = "";
var line4 = "";
var icon = "";



// Wrapper jQuery function to ensure that  the code isn't run until the browser has 
// finished rendering all the elements in the html.
$(function () {

    //get latitute and logitude for the city using openweathermap geocoding APIl to use in openweathermap API
    function getGeoCoords(city) {

        var requestURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey;
        console.log(requestURL);

        fetch(requestURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                console.log(data[0].lat, data[0].lon);


                coords.lat = data[0].lat,
                    coords.lon = data[0].lon

                console.log(coords.lat, coords.lon);


            });

    }

    //save the current city search in local storage
    function saveCity(city) {
        //add the latest city searched to the savedCities
        console.log('savecity = ' + city);
        city = city.trim();
        savedCities[savedCities.length] = city;


        //write savedCities to local storage
        localStorage.setItem("savedCities", JSON.stringify(savedCities));

        //display in saved search area
        console.log("curcity =  " + curCity + ".");
        if (curCity !== city) {

            //return for first iteration
            if (curCity === "") {
                curCity = city;
                return;
            }

            //form next iteration,save the last searched city in the search list
            var btn = $('<button>');

            btn.attr('class', 'p-2 m-2 rounded-pill w-100 border-0');
            // btn.attr('id', 'savedCity');
            btn.text(curCity);

            savedSearchEl.append(btn);
            curCity = city;
        }
    }

    //Get wweather of a city
    function getCityWeather(city, save) {

        console.log("getcityweather");
        //saveCity in local Storage if new new search
        if (save) {
            saveCity(city);
        }

        //get latitute and logitude fore the city to use in openweather API  
        // setTimeout(getGeoCoords(city), 10000);
        // console.log("getCityweather..." + coords.lat);

        var geoCordURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey;
        console.log(geoCordURL);

        fetch(geoCordURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                console.log(data[0].lat, data[0].lon);


                coords.lat = data[0].lat,
                    coords.lon = data[0].lon

                console.log(coords.lat, coords.lon);

                //call the openweathermap API with coordinates to get current day forecast
                var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + coords.lat + '&lon=' + coords.lon + '&units=imperial&appid=' + apiKey;

                fetch(requestUrl)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {

                        //add current weather to "today" section
                        line1 = $('<p>');
                        line1.attr('class', 'fw-bolder fs-2 p-2');
                        line1.text(city + " (" + dayjs().format('MM/DD/YYYY') + ") ");
                        // todayEl.append(line1);

                        icon = $('<img>');
                        icon.attr('src', 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '.png');
                        line1.append(icon);
                        //todayEl.prepend(line1, icon);
                        todayEl.append(line1);


                        line2 = $('<p>');
                        line2.addClass('p-2 fs-4');
                        line2.text("Temp: " + data.main.temp_max);
                        todayEl.append(line2);

                        line3 = $('<p>');
                        line3.addClass('p-2 fs-4');
                        line3.text("Wind: " + data.wind.speed + "MPH");
                        todayEl.append(line3);

                        line4 = $('<p>');
                        line4.addClass('p-2 fs-4');
                        line4.text("Humidity: " + data.main.humidity + "%");
                        todayEl.append(line4);

                    });

                //call the openweathermap API with coordinates to get 5 day forecast

                requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + coords.lat + '&lon=' + coords.lon + '&cnt=40&units=imperial&appid=' + apiKey;

                console.log(requestUrl);

                fetch(requestUrl)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        console.log(data);

                        var currDate = dayjs().format("YYYY-MM-DD");
                        var currTime = dayjs().format('hh:mm:ss');
                        var useTime = "";

                        if (currTime < "03:00:00")
                            useTime = "00:00:00";
                        else if (currTime < "06:00:00")
                            useTime = "03:00:00";
                        else if (currTime < "09:00:00")
                            useTime = "06:00:00";
                        else if (currTime < "12:00:00")
                            useTime = "09:00:00";
                        else if (currTime < "15:00:00")
                            useTime = "12:00:00";
                        else if (currTime < "18:00:00")
                            useTime = "15:00:00";
                        else if (currTime < "21:00:00")
                            useTime = "18:00:00";
                        else
                            useTime = "03:00:00";

                        console.log("useTime = " + useTime);

                        for (x = 1; x < 6; x++) {
                            var useDate = dayjs().add(x, 'day').format("YYYY-MM-DD");

                            var useDateTime = useDate + " " + useTime;

                            var i = 0;
                            while (i < data.list.length) {
                                if (useDateTime === data.list[i].dt_txt) {
                                    console.log(" and for " + x + " this dt " + useDateTime);

                                    var dayEl = $('#day' + x);

                                    //add current weather to "today" section
                                    line1 = $('<p>');
                                    line1.attr('class', 'fw-bolder fs-5 p-2');
                                    line1.text(dayjs().add(x, 'day').format('MM/DD/YYYY'));
                                    dayEl.append(line1);

                                    icon = $('<img>');
                                    icon.attr('src', 'http://openweathermap.org/img/wn/' + data.list[i].weather[0].icon + '.png');
                                    dayEl.append(icon);

                                    line2 = $('<p>');
                                    line2.addClass('p-2 fs-6');
                                    line2.text("Temp: " + data.list[i].main.temp_max);
                                    dayEl.append(line2);

                                    line3 = $('<p>');
                                    line3.addClass('p-2 fs-6');
                                    line3.text("Wind: " + data.list[i].wind.speed + "MPH");
                                    dayEl.append(line3);

                                    line4 = $('<p>');
                                    line4.addClass('p-2 fs-6');
                                    line4.text("Humidity: " + data.list[i].main.humidity + "%");
                                    dayEl.append(line4);

                                    break;
                                }
                                i++;
                            }
                        }

                    });

            });



    }

    //Display the weather of last city searched whent he program starts
    function getLastSearchWeather() {

        console.log("getlastSearchWeather");

        if (savedCities.length === 0)
            return;

        var lastCity = savedCities[savedCities.length - 1];

        cityEl.val(lastCity);

        getCityWeather(lastCity, false);

    }


    // Display all saved Cities in grey pill box buttons under Searchform on the sidebar
    function displaySavedCities() {

        for (i = 0; i < savedCities.length; i++) {
            var btn = $('<button>');

            btn.attr('class', 'p-2 m-2 rounded-pill w-100 border-0');
            // btn.attr('id', 'savedCity');
            btn.text(savedCities[i]);

            savedSearchEl.append(btn);
        }
        return;
    }

    // Get all cities stored in local storage savedCities array
    function getStoredCities() {
        var storedList = JSON.parse(localStorage.getItem("savedCities"));
        if (storedList !== null) {
            savedCities = storedList;
        }
        return;
    }

    searchBtnEl.on('click', function (event) {
        event.preventDefault();
        console.log('in click');
        console.log('inclick = ' + cityEl.val());
        getCityWeather(cityEl.val().trim());
    });

    document.addEventListener('click', function (event) {
        var el = event.target;

        event.preventDefault();

        if (el.matches('button') && (el.innerHTML !== 'Search')) {
            console.log("saved city clicked..." + el.innerHTML);
            cityEl.val(el.innerHTML);
            getCityWeather(cityEl.val().trim(), false);
        }
    });

    //initialiation function
    function init() {
        getStoredCities();

        displaySavedCities();

        getLastSearchWeather();
    }

    init();

});
