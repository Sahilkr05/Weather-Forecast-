const API_KEY = '277605ed4b97b05b8459bda7388c2d4d';


//event listeners for the button
document.getElementById('search-btn').addEventListener('click', function () {
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        fetchWeatherData(city);
        saveCityToLocalStorage(city); // Save city after searching
    } else {
        alert("Please enter a valid city name.");
    }
});

// Function to save the searched city in local storage
function saveCityToLocalStorage(city) {
    let searchedCities = JSON.parse(localStorage.getItem('searchedCities')) || [];
    if (!searchedCities.includes(city)) {
        searchedCities.push(city);
        localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
    }
    updateCityDropdown();
}

// Function to update the dropdown menu
function updateCityDropdown() {
    const cityDropdown = document.getElementById('cityDropdown');
    const searchedCities = JSON.parse(localStorage.getItem('searchedCities')) || [];
    cityDropdown.innerHTML = '<option value="">Recently Searched Cities</option>';

    searchedCities.forEach(city => {
        let option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        cityDropdown.appendChild(option);
    });
}

// Event listener for the dropdown selection
document.getElementById('cityDropdown').addEventListener('change', function() {
    const selectedCity = this.value;
    if (selectedCity) {
        fetchWeatherData(selectedCity);
    }
});

// On page load, update dropdown with previously searched cities
window.onload = function() {
    updateCityDropdown();
};


//weather of current location
document.getElementById('current-location-btn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherDataByLocation(lat, lon);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
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

function fetchWeatherDataByLocation(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);
            fetchForecastData(lat, lon);
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
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" class="mx-auto mt-2" alt="weather icon">
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
    forecastDiv.innerHTML = ``;
    
    forecastList.slice(0, 5).forEach(forecast => {
        const forecastDate = new Date(forecast.dt * 1000).toLocaleDateString("en-US");
        forecastDiv.innerHTML += `
            <div class="bg-blue-500 text-white p-4 rounded-lg shadow-lg my-2">
                <p class="text-md font-bold">${forecastDate}</p>
                <p>Temperature: ${forecast.main.temp}°C</p>
                <p>Weather: ${forecast.weather[0].description}</p>
                <p>Wind: ${forecast.wind.speed} m/s</p>
                <p>Humidity: ${forecast.main.humidity}%</p>
                <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" class="mx-auto mt-2" alt="forecast icon">
            </div>
        `;
    });
}