var apiKey = "148b1dd83875a9ac2ea73fc528fd06a9"
var searchCityButton = $("#search")

function handleSearch(event) {
    var searchCity =  $("#searchbar").val();
    if(!searchCity) searchCity = 'Kansas City';
    lookUpCity(searchCity);

    var newButton = $("<button>").val(searchCity).addClass("button is-light mt-1").text(searchCity)
    $("#pastSearch").prepend(newButton);
    newButton.on("click", null, searchCity,  handleHistory)

    console.log(searchCity+' clicked!');
};

function handleHistory(event) {
    console.log('history')    
    lookUpCity(event.data);
}

function lookUpCity(city, event) {
    
    if(!city)
    {
        console.log("got data")
        city = event.data;
    }
        

    var url = `https://api.openweathermap.org/geo/1.0/direct?q=${city},&appid=${apiKey}`

    fetch(url).then(function(response) {
        return response.json()
    }).then(function(data) {
        $("#city").text(`${city}`)
        getWeather(data[0].lat, data[0].lon)
    })
}

function getWeather(lat,lon) {
    var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    fetch(url).then(function(response) {
        return response.json()
    }).then(function(data) {
        console.log(data);
        $("#currentdate").text(`(${moment.unix(data.current.dt).format('MM/DD/yyyy')})`)
        $("#currentimage").attr("src",`https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`)
        var forecast = $("#forecast")
        var tempEl = $("#temp")
        var humidEl = $("#humidity")
        var windEl = $("#wind")
        var uvindexEl = $("#uvindex")
        var uvExposure = 'Low';
        if(data.current.uvi >= 3 && data.current.uvi < 5)
            uvExposure = 'Moderate'
        if(data.current.uvi >= 5 && data.current.uvi < 7)
            uvExposure = 'High'
        if(data.current.uvi >= 8)
            uvExposure = 'VeryHigh'

        tempEl.text(data.current.temp);
        humidEl.text(data.current.humidity);
        windEl.text(data.current.wind_speed);
        uvindexEl.text(data.current.uvi);
        uvindexEl.removeClass();
        uvindexEl.addClass("uv");
        uvindexEl.addClass(uvExposure);
        // add jquery.style to change background for uvindexel //
        forecast.empty(); //empty the forecast
        for (let i = 1; i < 6; i++) {
            const element = data.daily[i];
            
            var uvExposure = 'Low';
            if(element.uvi >= 3 && element.uvi < 5)
                uvExposure = 'Moderate'
            if(element.uvi >= 5 && element.uvi < 7)
                uvExposure = 'High'
            if(element.uvi >= 8)
                uvExposure = 'VeryHigh'

            var forecastDayElement = `
            <div class="column m-2">
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            ${moment.unix(element.dt).format('MM/DD/yyyy')}
                        </p>
                    </header>
                    <div class="card-content">
                        <img class="card-image" src="https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png" alt="Card image cap">
                        <p class="card-text">Temperature: ${element.temp.max}</p>
                        <p class="card-text">Humidity: ${element.humidity}</p>
                        <p class="card-text">Wind Speed: ${element.wind_speed}</p>
                        <p class="card-text">UV Index: <span class="uv ${uvExposure}">${element.uvi}</span></p>
                    </div>
                </div>
            </div>`
          forecast.append(forecastDayElement)
        }

    })
}

searchCityButton.on("click", handleSearch)
