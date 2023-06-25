let apiKey = "obd7f8ea0640624396b700c2ade6450t";
let unit = "metric";
let temperature = document.querySelector("#temperature");
let city = document.querySelector("#city-name");
let mainWeatherIcon = document.querySelector("#main-weather-icon");
let humidity = document.querySelector("#humidity");
let wind = document.querySelector("#wind");
let feel = document.querySelector("#feels-like");
let currentDateAndTime = document.querySelector("#current-date-time");
let thisDay = document.querySelector("#today");

function formatDate(timestamp) {
  let now = new Date(timestamp);
  let daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = daysOfWeek[now.getDay()];
  let hours = now.getHours();
  let minutes = now.getMinutes();

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `Last updated: ${day} ${hours}:${minutes}`;
}

function getCurrentTemperature(response) {
  currentDateAndTime.innerHTML = formatDate(response.data.time * 1000);

  let roundedTemp = Math.round(response.data.temperature.current);
  temperature.innerHTML = `${roundedTemp}`;

  let locationName = response.data.city;
  city.innerHTML = locationName;
  document.querySelector("#country").innerHTML = response.data.country;

  document.querySelector("#description").innerHTML =
    response.data.condition.description;

  mainWeatherIcon.setAttribute("src", response.data.condition.icon_url);

  let humidityValue = response.data.temperature.humidity;
  let windValue = Math.round(response.data.wind.speed);
  let realFeel = Math.round(response.data.temperature.feels_like);
  humidity.innerHTML = `${humidityValue}%`;
  wind.innerHTML = `${windValue}km/h`;
  feel.innerHTML = `${realFeel}°C`;
}

function getCurrentCoordinates(position) {
  let latitude = position.coords.latitude.toFixed(2);
  let longitude = position.coords.longitude.toFixed(2);
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${longitude}&lat=${latitude}&units=${unit}&key=${apiKey}`;

  axios.get(`${apiUrl}`).then(getCurrentTemperature);
}

function displayTemp(response) {
  city.innerHTML = response.data.city;
  document.querySelector("#country").innerHTML = response.data.country;
  temperature.innerHTML = Math.round(response.data.temperature.current);
  let realFeel = Math.round(response.data.temperature.feels_like);
  let humidityValue = response.data.temperature.humidity;
  let windValue = Math.round(response.data.wind.speed);
  feel.innerHTML = `${realFeel}°C`;
  humidity.innerHTML = `${humidityValue}%`;
  wind.innerHTML = `${windValue}km/h`;
  document.querySelector("#description").innerHTML =
    response.data.condition.description;
  mainWeatherIcon.setAttribute("src", response.data.condition.icon_url);
  currentDateAndTime.innerHTML = formatDate(response.data.time * 1000);
}

function displayCity(event) {
  event.preventDefault();
  let inputCity = document.querySelector("#input-city").value;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${inputCity}&units=${unit}&key=${apiKey}`;

  axios.get(`${apiUrl}`).then(displayTemp);
}
let searchForm = document.querySelector("#searchcity-form");
searchForm.addEventListener("submit", displayCity);

searchForm.addEventListener("submit", function handleSubmit(event) {
  event.preventDefault();
  searchForm.reset();
});

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCurrentCoordinates);
}
let currentLocationTemperature = document.querySelector("#current-weather");
currentLocationTemperature.addEventListener("click", getCurrentLocation);
