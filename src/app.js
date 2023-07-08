let apiKey = "obd7f8ea0640624396b700c2ade6450t";
let unit = "metric";
let temperature = document.querySelector("#temperature");
let city = document.querySelector("#city-name");
let mainWeatherIcon = document.querySelector("#main-weather-icon");
let humidity = document.querySelector("#humidity");
let wind = document.querySelector("#wind");
let feel = document.querySelector("#feels-like");
let pressure = document.querySelector("#pressure");
let currentDateAndTime = document.querySelector("#current-date-time");
let thisDay = document.querySelector("#today");
let celciusTemp = null;

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

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = daysOfTheWeek[date.getDay()];

  return day;
}

function formatTime(timestamp) {
  let now = new Date(timestamp * 1000);
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}:00`;
  } else {
    hours = `${hours}:00`;
  }

  return hours;
}

function showDailyForecast(response) {
  let dailyForecastElement = document.querySelector("#daily-forecast");
  let forecastHTML = "";
  let forecastForDays = response.data.daily;

  forecastForDays.forEach(function (forecastDay, index) {
    if (index < 7) {
      forecastHTML =
        forecastHTML +
        `
        <div class="row daily-forecast">
          <div class="col-2 days daily-item">
            <div class="daily-weather-forecast-day">${formatDay(
              forecastDay.time
            )}</div>
          </div>
          <div class="col-7 feel daily-item">
            <img
              src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                forecastDay.condition.icon
              }.png""
              class="img-fluid icon"
              alt="weather icon"
              width="20px"
            />
            <span>${forecastDay.condition.description}</span>
          </div>
          <div class="col-3 daily-temp daily-item">
            <div class="daily-weather-forecast-day">
              ${Math.round(forecastDay.temperature.maximum)}<span>/${Math.round(
          forecastDay.temperature.minimum
        )}</span>
            </div>
          </div>
        </div>
      `;
    }
  });

  dailyForecastElement.innerHTML = forecastHTML;
}

function showHourlyForecast(response) {
  let hourlyForecastElement = document.querySelector("#hourly-forecast");
  let hourlyForecastHTML = `<div class="row">`;
  let forecastForHours = response.data.hourly;

  forecastForHours.forEach(function (forecastHour, index) {
    if (index < 6) {
      hourlyForecastHTML =
        hourlyForecastHTML +
        `
        <div class="col-2">
          <div class="time">${formatTime(forecastHour.dt)}</div>
          <img
            src ="http://openweathermap.org/img/wn/${
              forecastHour.weather[0].icon
            }@2x.png"
            class="img-fluid"
            alt="weather icon"
            width="30px"
          />
          <div class="hourly-temp">${Math.round(forecastHour.temp)}°C</div>
        </div>
      `;
    }
  });

  hourlyForecastHTML += `</div>`;
  hourlyForecastElement.innerHTML = hourlyForecastHTML;
}

function getForecast(coordinates) {
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&units=${unit}&key=${apiKey}`;
  axios.get(apiUrl).then(showDailyForecast);
}

function getHourlyForecast(coordinates) {
  let apiId = "1ee4264117b73d2263eecd562f31ef5c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${apiId}&units=${unit}`;
  axios.get(apiUrl).then(showHourlyForecast);
}

function getCurrentTemperature(response) {
  currentDateAndTime.innerHTML = formatDate(response.data.time * 1000);
  celciusTemp = Math.round(response.data.temperature.current);
  temperature.innerHTML = `${celciusTemp}`;

  let locationName = response.data.city;
  city.innerHTML = locationName;
  document.querySelector("#country").innerHTML = response.data.country;

  document.querySelector("#description").innerHTML =
    response.data.condition.description;

  mainWeatherIcon.setAttribute("src", response.data.condition.icon_url);

  let humidityValue = response.data.temperature.humidity;
  let windValue = Math.round(response.data.wind.speed);
  let realFeel = Math.round(response.data.temperature.feels_like);
  let pressureValue = response.data.temperature.pressure;
  humidity.innerHTML = `${humidityValue}%`;
  wind.innerHTML = `${windValue}km/h`;
  feel.innerHTML = `${realFeel}°C`;
  pressure.innerHTML = `${pressureValue}hPa`;

  getForecast(response.data.coordinates);
  getHourlyForecast(response.data.coordinates);
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
  celciusTemp = Math.round(response.data.temperature.current);
  temperature.innerHTML = `${celciusTemp}`;
  let realFeel = Math.round(response.data.temperature.feels_like);
  let humidityValue = response.data.temperature.humidity;
  let windValue = Math.round(response.data.wind.speed);
  let pressureValue = response.data.temperature.pressure;
  feel.innerHTML = `${realFeel}°C`;
  humidity.innerHTML = `${humidityValue}%`;
  wind.innerHTML = `${windValue}km/h`;
  pressure.innerHTML = `${pressureValue}hPa`;
  document.querySelector("#description").innerHTML =
    response.data.condition.description;
  mainWeatherIcon.setAttribute("src", response.data.condition.icon_url);
  currentDateAndTime.innerHTML = formatDate(response.data.time * 1000);

  getForecast(response.data.coordinates);
  getHourlyForecast(response.data.coordinates);
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

function convertTempToFahrenheit(event) {
  event.preventDefault();
  celciusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemp = Math.round((celciusTemp * 9) / 5 + 32);
  temperature.innerHTML = fahrenheitTemp;
}

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertTempToFahrenheit);

function convertTempToCelcius(event) {
  event.preventDefault();
  fahrenheitLink.classList.remove("active");
  celciusLink.classList.add("active");
  temperature.innerHTML = celciusTemp;
}

let celciusLink = document.querySelector("#celcius-link");
celciusLink.addEventListener("click", convertTempToCelcius);