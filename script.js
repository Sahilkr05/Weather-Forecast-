const API_KEY = '277605ed4b97b05b8459bda7388c2d4d';

document.getElementById('search-btn').addEventListener('click', function () {
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        fetchWeatherData(city);
    } else {
        alert("Please enter a valid city name.");
    }
});

function fetchWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayWeatherData(data);
                fetchForecastData(data.coord.lat, data.coord.lon);
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error("Error fetching weather data:", error));
}

function displayWeatherData(data) {
    const weatherDiv = document.getElementById('weather-data');
    weatherDiv.innerHTML = `
        <h2 class="text-2xl font-bold">${data.name}, ${data.sys.country}</h2>
        <p class="text-lg">Temperature: ${data.main.temp}°C</p>
        <p class="text-lg">Weather: ${data.weather[0].description}</p>
        <p class="text-lg">Humidity: ${data.main.humidity}%</p>
        <p class="text-lg">Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

function fetchForecastData(lat, lon) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayForecastData(data.list);
        })
        .catch(error => console.error("Error fetching forecast data:", error));
}

function displayForecastData(forecastList) {
    const forecastDiv = document.getElementById('forecast-data');
    forecastDiv.innerHTML = `<h3 class="text-xl font-bold">5-Day Forecast</h3>`;
    
    forecastList.slice(0, 5).forEach(forecast => {
        const forecastDate = new Date(forecast.dt * 1000).toLocaleDateString("en-US");
        forecastDiv.innerHTML += `
            <div class="bg-white p-4 rounded-lg shadow-lg my-2">
                <p class="text-md font-bold">${forecastDate}</p>
                <p>Temperature: ${forecast.main.temp}°C</p>
                <p>Weather: ${forecast.weather[0].description}</p>
                <p>Wind: ${forecast.wind.speed} m/s</p>
                <p>Humidity: ${forecast.main.humidity}%</p>
            </div>
        `;
    });
}