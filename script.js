function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

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

  return `${day} ${hours}:${minutes}`;
}

function displayWeatherCondition(response) {
  let cityElement = document.querySelector("#city");
  let temperatureElement = document.querySelector(".temperature");
  let descriptionElement = document.querySelector("#description");
  let windElement = document.querySelector("#wind-speed");
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
  minElement.innerHTML = Math.round(minumumTemperature);
  maxElement.innerHTML = Math.round(maximumTemperature);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

function search(city) {
  let apiKey = "0b30cafebd8d5bb399808305b47c35f0";
  let unit = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

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
