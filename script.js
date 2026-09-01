const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const weatherIcon = document.getElementById("weatherIcon");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");


searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        getWeather();
    }
});


async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city name!");
        return;
    }

    try {

        // Find the city
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            alert("City not found!");
            return;
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        const cityName = location.name;
        const country = location.country;


        // Get real weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=kmh`
        );

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;


        // Update temperature
        temperature.textContent =
            `${Math.round(current.temperature_2m)}°C`;


        // Update humidity
        humidity.textContent =
            `${current.relative_humidity_2m}%`;


        // Update wind
        wind.textContent =
            `${Math.round(current.wind_speed_10m)} km/h`;


        // Update feels like
        feelsLike.textContent =
            `${Math.round(current.apparent_temperature)}°C`;


        // Weather condition
        const weather = getWeatherInfo(current.weather_code);

        weatherIcon.textContent = weather.icon;

        condition.textContent =
            `${weather.text} - ${cityName}, ${country}`;

    } 
    
    catch (error) {

        console.error(error);

        alert("Unable to get weather data. Please try again.");

    }
}


// Convert weather code into condition
function getWeatherInfo(code) {

    if (code === 0) {
        return {
            text: "Clear Sky",
            icon: "☀️"
        };
    }

    if (code === 1 || code === 2) {
        return {
            text: "Partly Cloudy",
            icon: "🌤️"
        };
    }

    if (code === 3) {
        return {
            text: "Cloudy",
            icon: "☁️"
        };
    }

    if (code >= 45 && code <= 48) {
        return {
            text: "Foggy",
            icon: "🌫️"
        };
    }

    if (code >= 51 && code <= 57) {
        return {
            text: "Drizzle",
            icon: "🌦️"
        };
    }

    if (code >= 61 && code <= 67) {
        return {
            text: "Rainy",
            icon: "🌧️"
        };
    }

    if (code >= 71 && code <= 77) {
        return {
            text: "Snowy",
            icon: "❄️"
        };
    }

    if (code >= 80 && code <= 82) {
        return {
            text: "Rain Showers",
            icon: "🌦️"
        };
    }

    if (code >= 95 && code <= 99) {
        return {
            text: "Thunderstorm",
            icon: "⛈️"
        };
    }

    return {
        text: "Unknown",
        icon: "🌤️"
    };
}