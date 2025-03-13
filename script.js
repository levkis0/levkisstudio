const apiKey = "5d5d8d35740cabf7e723aa4ac9d44954"; // Замініть на ваш API ключ OpenWeather

document.getElementById("search-btn").addEventListener("click", () => {
  const city = document.getElementById("city-input").value;
  if (city) {
    fetchWeatherData(city);
  }
});

async function fetchWeatherData(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=ua&appid=${apiKey}`
    );
    if (!response.ok) throw new Error("Місто не знайдено");
    const data = await response.json();
    updateCurrentWeather(data);
    updateForecast(data);
  } catch (error) {
    document.getElementById("error-message").textContent = error.message;
    document.getElementById("error-message").classList.remove("hidden");
  }
}

function updateCurrentWeather(data) {
  const currentWeather = data.list[0];
  document.getElementById("city-name").textContent = data.city.name;
  document.getElementById("current-date").textContent = new Date(
    currentWeather.dt_txt
  ).toLocaleDateString("uk-UA");
  document.getElementById(
    "current-temp"
  ).textContent = `${currentWeather.main.temp}°C`;
  document.getElementById("current-description").textContent =
    currentWeather.weather[0].description;
  document.getElementById(
    "current-icon"
  ).src = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`;
  document.getElementById(
    "wind"
  ).textContent = `Вітер: ${currentWeather.wind.speed} м/с`;
  document.getElementById(
    "humidity"
  ).textContent = `Вологість: ${currentWeather.main.humidity}%`;
  document.getElementById(
    "pressure"
  ).textContent = `Тиск: ${currentWeather.main.pressure} гПа`;
  document.getElementById("current-weather").classList.remove("hidden");
}

function updateForecast(data) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";
  for (let i = 0; i < data.list.length; i += 8) {
    const dayData = data.list[i];
    const forecastElement = document.createElement("div");
    forecastElement.classList.add("forecast-day", "glass-effect");
    forecastElement.innerHTML = `
            <p>${new Date(dayData.dt_txt).toLocaleDateString("uk-UA")}</p>
            <img src="https://openweathermap.org/img/wn/${
              dayData.weather[0].icon
            }.png" alt="Іконка погоди">
            <p>${dayData.main.temp}°C</p>
            <p>${dayData.weather[0].description}</p>
        `;
    forecastContainer.appendChild(forecastElement);
  }
  document.getElementById("forecast-container").classList.remove("hidden");
}
