function formatDate(timestamp) {
  let date = new Date(timestamp);

  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];

  return `${day} ${formatHours(timestamp)}`;
}

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}

function displayForecast(response) {
  console.log(response.data.daily);
  let forecastElement = document.querySelector("#forecast");

  let days = ["Thu", "Fri", "Sat"];

  let forecastHTML = `<div class="row">`;
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
      <div class="col-2">
        <div class="weather-forecast-date">${day}</div>
        <img
          src="http://openweathermap.org/img/wn/50d@2x.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> 18° </span>
          <span class="weather-forecast-temperature-min"> 12° </span>
        </div>
      </div>
  `;
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "0b30cafebd8d5bb399808305b47c35f0";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function displayWeatherCondition(response) {
  let cityElement = document.querySelector("#city");
  let temperatureElement = document.querySelector(".temperature");
  let descriptionElement = document.querySelector("#description");
  let windElement = document.querySelector("#wind-speed");
  let humidityElement = document.querySelector("#humidity");
  let minElement = document.querySelector("#temp-min");
  let maxElement = document.querySelector("#temp-max");
  let dateElement = document.querySelector("#current-date");
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.main.temp;
  minumumTemperature = response.data.main.temp_min;
  maximumTemperature = response.data.main.temp_max;

  cityElement.innerHTML = response.data.name;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  descriptionElement.innerHTML = response.data.weather[0].description;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  humidityElement.innerHTML = response.data.main.humidity;
  minElement.innerHTML = Math.round(minumumTemperature);
  maxElement.innerHTML = Math.round(maximumTemperature);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "0b30cafebd8d5bb399808305b47c35f0";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeatherCondition);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-city-input").value;
  search(city);
}

function searchLocation(position) {
  let apiKey = "0b30cafebd8d5bb399808305b47c35f0";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeatherCondition);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector(".temperature");
  let minElement = document.querySelector("#temp-min");
  let maxElement = document.querySelector("#temp-max");

  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let minFahrenheitTemperature = (minumumTemperature * 9) / 5 + 32;
  let maxFahrenheitTemperature = (maximumTemperature * 9) / 5 + 32;
  minElement.innerHTML = Math.round(minFahrenheitTemperature);
  maxElement.innerHTML = Math.round(maxFahrenheitTemperature);
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector(".temperature");
  let minElement = document.querySelector("#temp-min");
  let maxElement = document.querySelector("#temp-max");

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  minElement.innerHTML = Math.round(minumumTemperature);
  maxElement.innerHTML = Math.round(maximumTemperature);
}

let celsiusTemperature = null;
let minumumTemperature = null;
let maximumTemperature = null;

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let currentLocationBtn = document.querySelector("#current-location-btn");
currentLocationBtn.addEventListener("click", getCurrentLocation);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

search("Prague");
displayForecast();
