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

function getCurrentLocation() {
  function getCurrentTemperature(response) {
    let currentDateAndTime = document.querySelector("#current-date-time");
    currentDateAndTime.innerHTML = formatDate(response.data.dt * 1000);
    let currentTemperature = document.querySelector("#temperature");
    let roundedTemp = Math.round(response.data.main.temp);
    currentTemperature.innerHTML = `${roundedTemp}`;

    let currentLocation = document.querySelector("#city-name");
    let locationName = response.data.name;
    currentLocation.innerHTML = locationName;

    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    document.querySelector("#country").innerHTML = regionNames.of(
      response.data.sys.country
    );
    document.querySelector("#description").innerHTML =
      response.data.weather[0].description;

    let humidity = document.querySelector("#humidity");
    let wind = document.querySelector("#wind");
    let feel = document.querySelector("#feels-like");
    let humidityValue = response.data.main.humidity;
    let windValue = Math.round(response.data.wind.speed);
    let realFeel = Math.round(response.data.main.feels_like);
    humidity.innerHTML = `${humidityValue}%`;
    wind.innerHTML = `${windValue}km/h`;
    feel.innerHTML = `${realFeel}°C`;
  }

  function getCurrentCoordinates(position) {
    let latitude = position.coords.latitude.toFixed(2);
    let longitude = position.coords.longitude.toFixed(2);
    let unit = "metric";
    let apiKey = "082d3d02ffdb12f2fd9b259e2ced1d0d";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`;

    axios.get(`${apiUrl}`).then(getCurrentTemperature);
  }
  navigator.geolocation.getCurrentPosition(getCurrentCoordinates);
}
let currentLocationTemperature = document.querySelector("#current-weather");
currentLocationTemperature.addEventListener("click", getCurrentLocation);
