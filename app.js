const app = {
  key: 'f20b155e85fa88963c7bb356b08bcd3b', //openweathermap.org APPID
  init: () => {
    document
      .getElementById('btnGet')
      .addEventListener('click', app.fetchWeather);
    document
      .getElementById('btnCurrent')
      .addEventListener('click', app.getLocation);
    document
      .getElementById('btnRandom')
      .addEventListener('click', app.getRandomCoordinates);
  },
  fetchWeather: () => {
    let lat = document.getElementById('latitude').value;
    let lon = document.getElementById('longitude').value;
    let lang = 'en';
    let units = 'metric';
    const yourLoc = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${app.key}`;
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${app.key}&units=${units}&lang=${lang}`;
    fetch(url)
      .then((resp) => {
        if (!resp.ok) throw new Error(resp.statusText);
        return resp.json();
      })
      .then((data) => {
        document.getElementById(
          'currentTemp'
        ).innerText = `Current Temp: ${data.current.temp}`;
        app.showWeather(data);
      })
      .catch(console.err);
    fetch(yourLoc)
      .then((resp) => {
        if (!resp.ok) throw new Error(resp.statusText);
        console.log(yourLoc);
        return resp.json();
      })
      .then((data) => {
        document.getElementById(
          'currentLocal'
        ).innerText = `Locality: ${data[0].name}`;
        document.getElementById(
          'currentCountry'
        ).innerText = `Country: ${data[0].country}`;
      })
      .catch(console.err);
  },
  getLocation: () => {
    let options = {
      enableHighAccuracy: true,
      timeout: 1000 * 10,
      maximumAge: 1000 * 60 * 5,
    };
    navigator.geolocation.getCurrentPosition(app.success, app.error, options);
  },
  success: (position) => {
    const lon = position.coords.longitude;
    const lat = position.coords.latitude;
    document.getElementById('latitude').value = lat.toFixed(2);
    document.getElementById('longitude').value = lon.toFixed(2);

    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const yourLoc = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${app.key}`;
    console.log(yourLoc);
    fetch(yourLoc)
      .then((resp) => {
        if (!resp.ok) throw new Error(resp.statusText);
        return resp.json();
      })
      .then((data) => {
        document.getElementById(
          'currentLocal'
        ).innerText = `Locality: ${data[0].name}`;
        document.getElementById(
          'currentCountry'
        ).innerText = `Country: ${data[0].country}`;
      })
      .catch(console.err);
  },
  error: (err) => {
    console.log(err);
  },
  showWeather: (resp) => {
    let row = document.querySelector('.weather.row');
    row.innerHTML = resp.daily
      .map((day, idx) => {
        if (idx <= 2) {
          let dt = new Date(day.dt * 1000);
          return `<div class="col">
          <h2>Forecast Day ${idx + 1}</h2>
          <div class="card" >
            <h5 class="card-title p-2">${dt.toDateString()}</h5>            
            <div class="card-body">
            <p><img
              src="http://openweathermap.org/img/wn/${
                day.weather[0].icon
              }@4x.png"             
              alt="${day.weather[0].description}"
            /></p>
              <h3 class="card-title">${day.weather[0].main}</h3>              
              <h3 class="card-text">High: ${day.temp.max}&deg;C</h3>
              <h3 class="card-text">Low: ${day.temp.min}&deg;C</h3>
              <br>
              <p class="card-text"> Feels like ${day.feels_like.day}</p>
              <p class="card-text">Pressure ${day.pressure} mb</p>
              <p class="card-text">Humidty ${day.humidity}%</p>
              <p class="card-text">Precipitation ${Math.round(
                day.pop.toFixed(2) * 100
              )}%</p>
              <p class="card-text">Dew Point ${day.dew_point}</p>
              <p class="card-text">Wind ${day.wind_speed} m/s
          </p>
            </div>
          </div>
        </div>`;
        }
      })
      .join(' ');
  },
  getRandomInRange: (from, to, fixed) => {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
  },
  getRandomCoordinates: () => {
    document.getElementById('latitude').value = app.getRandomInRange(
      -90,
      90,
      3
    );
    document.getElementById('longitude').value = app.getRandomInRange(
      -180,
      180,
      3
    );
  },
};

app.init();
