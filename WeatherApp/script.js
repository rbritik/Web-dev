const weatherForm = document.querySelector(".weatherForm");
const card = document.querySelector(".card");
const cityInput = document.querySelector("#cityInput");
const apiKey = 'ee708dcf61f08008ba5b81a5c24e09d3';

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const cityName = cityInput.value;
    if (cityName == "") {
        errorDisplay("Please enter city name");
    }
    else {
        try {
            const weatherInfo = await getWeatherData(cityName);
            displayWeatherInfo(weatherInfo);
        }
        catch (error) {
            console.error(error);
            errorDisplay(error);
        }
    }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Could not fetch weather data");
    }

    return await response.json();
}

function displayWeatherInfo(data) {
    const {name: city,
           main: {temp, humidity},
           weather: [{description, id}]} = data;
    
    const cityDisplay = document.createElement('h1');
    const tempDisplay = document.createElement('p');
    const humidityDisplay = document.createElement('p');
    const descDisplay = document.createElement('p');
    const weatherEmojiDisplay = document.createElement('p');
    
    cityDisplay.textContent = city;
    tempDisplay.textContent = `${(temp-273.15).toFixed(1)}°C`;
    humidityDisplay.textContent = `humdity: ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmojiDisplay.textContent = getWeatherEmoji(id);

    cityDisplay.classList.add('cityDisplay');
    tempDisplay.classList.add('tempDisplay');
    humidityDisplay.classList.add('humidityDisplay');
    descDisplay.classList.add('descDisplay');
    weatherEmojiDisplay.classList.add('emojiDisplay');

    card.textContent = "";
    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmojiDisplay);
}

function getWeatherEmoji(weatherId) {
    switch(true) {
        case (weatherId >= 200 && weatherId < 300):
            return '🌧';
        case (weatherId >= 300 && weatherId < 400):
            return '🌨';
        case (weatherId >= 500 && weatherId < 600):
            return '🌧';
        case (weatherId >= 600 && weatherId < 700):
            return '☃';
        case (weatherId >= 700 && weatherId < 800):
            return '🌁';
        case (weatherId === 800):
            return '🌞';
        case (weatherId >= 801 && weatherId < 810):
            return '☁';
        default:
            return '❓';
    }
}

function errorDisplay(message) {
    const errorDisp = document.createElement("p");
    errorDisp.textContent = message;
    errorDisp.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisp);
}