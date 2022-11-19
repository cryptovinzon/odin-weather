const API_KEY = '241d95adc47debe8f409c8284b70791c'
const URL = 'https://api.openweathermap.org'

const getWeather = async(coordinates) => {    
    try {
        const lat = coordinates[0].lat;
        const lon = coordinates[0].lon;

        const response = await fetch(`${URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const weather = await response.json();
        return weather;
    } catch (err) {
        console.log('error')
    }
}

const getCoordinates = async(city) => {
    const response = await fetch(`${URL}/geo/1.0/direct?q=${city}&appid=${API_KEY}`);
    const coordinates = await response.json();
    return coordinates;
}

function filterData(obj) {
    const report = {
        "City": obj.name,
        "Temps": {
            "Current": obj.main.temp,
            "High": obj.main.temp_max,
            "Low": obj.main.temp_min
        }
    }    
    return report
}

function displayReport(obj) {
    const weatherDiv = document.querySelector('.weather');

    // remove existing data
    while (weatherDiv.lastElementChild) {
        weatherDiv.removeChild(weatherDiv.lastElementChild);
    }

    const cityDiv = document.createElement('div');
    cityDiv.textContent = Object.values(obj)[0];    
    weatherDiv.appendChild(cityDiv);
    
    const temps = obj.Temps;
    Object.keys(temps).forEach(key => {
        const div = document.createElement('div');
        const celcius = toCelcius(temps[key]);
        div.textContent = `${key} ${celcius}`;
        weatherDiv.appendChild(div);     
    })    
}

function toCelcius(temp) {
    return Math.round(temp - 273.15);
}

document.getElementById('submit').addEventListener('click', function(e) {
    const city = document.getElementById('city').value;
    submitForm(city)
    e.preventDefault()
})

const submitForm = async(city) => {
    const coordinates = await getCoordinates(city);
    const data = await getWeather(coordinates);
    const weatherReport = filterData(data);
    displayReport(weatherReport);
}
