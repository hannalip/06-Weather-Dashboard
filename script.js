//Previous History
var searchedArray = JSON.parse(window.localStorage.getItem("searchedCity")) || [];
console.log(searchedArray)
for (var i = 0; i < searchedArray.length; i++) {
    makelist(searchedArray[i])
}

// API key
var APIKey = "e81f0537589234627d5b1a48e0ed13db";

//Event Listener on City Search
$(document).ready(function () {
    $("#find-city").on("click", function (event) {
        //don't refresh the screen
        event.preventDefault();
        // Here we grab the text from the input box
        var searchedCity = $("#city-input").val();
        clear();
        $("#city-input").val("");
        //to store searched values
        searchedArray.push(searchedCity);
        //when we enter new city check in the array if the city is excisting or not and push the search history into array 
        window.localStorage.setItem("searchedCity", JSON.stringify(searchedArray));
        makelist(searchedCity)
        getweather(searchedCity);
    });
});

function getweather(searchedCity) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
        searchedCity + "&units=imperial&appid=" + APIKey;

    // CURRENT CONDITION

    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })

        // We store all of the retrieved data inside of an object called "response"
        .then(function (response) {
            console.log(response)
            //create the container/card
            var currentCard = $("<div>").attr("class", "card bg-light");
            $("#cityforecast").append(currentCard);
            //add location to card header
            var cardHeader = $("<div>").attr("class", "card-header").text("Current weather for " + response.name);
            currentCard.append(cardHeader);

            var cardRow = $("<div>").attr("class", "row");
            currentCard.append(cardRow);

            // get icon onto card
            var iconURL = "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";

            var imgDiv = $("<div>").attr("class", "col-md-4").append($("<img>").attr("src", iconURL).attr("class", "card-img"));
            cardRow.append(imgDiv);

            // Transfer content to HTML
            //display city name
            var textDiv = $("<div>").attr("class", "col-md-8");
            var cardBody = $("<div>").attr("class", "card-body");
            textDiv.append(cardBody);
            cardBody.append($("<h3>").attr("class", "card-title").text(response.name + " Weather Details"));
            //display last updated
            var currentDate = moment(response.dt, "X").format("dddd, MMMM Do YYYY, h:mm a");
            cardBody.append($("<p>").attr("class", "card-text").append($("<small>").attr("class", "text-muted").text("Last updated: " + currentDate)));
            //display Temperature
            cardBody.append($("<p>").attr("class", "card-text").html("Temperature: " + response.main.temp + " &#8457;"));
            //display Humidity
            cardBody.append($("<p>").attr("class", "card-text").text("Humidity: " + response.main.humidity + "%"));
            //display Wind Speed
            cardBody.append($("<p>").attr("class", "card-text").text("Wind Speed: " + response.wind.speed + " MPH"));


            // $(".wind").text("Wind Speed: " + response.wind.speed);
            // $(".humidity").text("Humidity: " + response.main.humidity);
            // $(".temp").text("Temperature (F): " + response.main.temp);


            // Call for UV Index
            var lat = response.coord.lat
            var lon = response.coord.lon
            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/uvi?" + "lat=" +
                    lat + "&lon=" + lon + "&appid=" + APIKey,
                method: "GET"
            })
                .then(function (uvIndexResponse) {
                    var uvNumber = uvIndexResponse.value;
                    var uvColor;
                    if (uvNumber <= 2) {
                        uvColor = "green";
                    }
                    else if (uvNumber >= 2 || uvNumber <= 5) {
                        uvColor = "yellow";
                    }
                    else if (uvNumber >= 5 || uvNumber <= 7) {
                        uvColor = "orange";
                    }
                    else {
                        uvColor = "red";
                    }
                    var uvDiv = $("<p>").attr("class", "card-text").text("UV Index: ");
                    uvDiv.append($("<span>").attr("class", "uvIndex").attr("style", ("background-color:" + uvColor)).text(uvNumber));
                    cardBody.append(uvDiv);
                });
            cardRow.append(textDiv);
  
            // //Call for 5 Day Forecast
            var cityID = response.id
            getForecast(cityID)

        });
};


// function uvIndex(lat, lon) {

      
  
// };

function clear() {
    //clear all the weather
    $("#cityforecast").empty();
}

// 5 Day Forcast Function
function getForecast(cityID) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&units=imperial&appid=" + APIKey,
        method: "GET"
    })
        .then(function (fiveDayResponse) {
            var fiverow = $("<div>").attr("class", "forecast");
            $("#cityforecast").append(fiverow);

            //array for 5 Day forecasts at 12:00
            for (var i = 0; i < fiveDayResponse.list.length; i++) {
                if (fiveDayResponse.list[i].dt_txt.indexOf("12:00:00") !== -1) {
                    var newCol = $("<div>").attr("class", "fivecards");
                    fiverow.append(newCol);

                    var newCard = $("<div>").attr("class", "card text-white bg-primary");
                    newCol.append(newCard);

                    var cardHead = $("<div>").attr("class", "card-header").text(moment(fiveDayResponse.list[i].dt, "X").format("MMM Do"));
                    newCard.append(cardHead);

                    var cardImg = $("<img>").attr("class", "card-img-top").attr("src", "https://openweathermap.org/img/wn/" + fiveDayResponse.list[i].weather[0].icon + "@2x.png");
                    newCard.append(cardImg);

                    var bodyDiv = $("<div>").attr("class", "card-body");
                    newCard.append(bodyDiv);

                    bodyDiv.append($("<p>").attr("class", "card-text").html("Temp: " + fiveDayResponse.list[i].main.temp + " &#8457;"));
                    bodyDiv.append($("<p>").attr("class", "card-text").text("Humidity: " + fiveDayResponse.list[i].main.humidity + "%"));
                    // console.log(fiveDayResponse)
                    // $(".forecast").text(fiveDayResponse.list[0].dt_txt)
                    // $(".icon").text(fiveDayResponse.list[0].weather[0].icon)
                    // $(".fiveTemp").text("Temp: " + fiveDayResponse.list[0].main.temp)
                    // $(".fiveHumidity").text("Humidity: " + fiveDayResponse.list[0].main.humidity)
                }
            }
        });
};



function makelist(name) {
    var li = $("<li>").addClass("list-group-item").text(name);
    $(".searchedHistory").append(li)
}
$(".searchedHistory").on("click", "li", function () {
    console.log($(this).text());
    getweather($(this).text())
})

function clear() {
    //clear all the weather
    $("#cityforecast").empty();
}
