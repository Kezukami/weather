import React, { useState } from 'react';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [weather, setWeather] = useState({
    loading: false,
    data: null,
    error: false,
  });

  const searchWeather = async (event) => {
    if (event.key !== 'Enter') return;

    event.preventDefault();

    const city = input.trim();
    if (!city) return;

    setWeather({ loading: true, data: null, error: false });

    try {
      const response = await axios.get(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            q: city,
            units: 'imperial',
            appid: process.env.REACT_APP_WEATHER_API_KEY,
          },
        }
      );

      setWeather({ loading: false, data: response.data, error: false });
      setInput('');
    } catch (error) {
      setWeather({ loading: false, data: null, error: true });
    }
  };

  const formatDate = (weatherData) => {
    const localTime = new Date(
      (weatherData.dt + weatherData.timezone) * 1000
    );

    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(localTime);
  };

  return (
    <div className="App">
      <h1 className="app-name">Weather App</h1>

      <input
        type="text"
        className="city-search"
        placeholder="Enter a city and press Enter"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={searchWeather}
      />

      {weather.loading && (
        <div className="Loader">
          <Oval color="black" height={70} width={70} />
        </div>
      )}

      {weather.error && (
        <p className="error-message">
          <FontAwesomeIcon icon={faFrown} /> City not found
        </p>
      )}

      {weather.data && (
        <div>
          <div className="city-name">
            <h2>
              {weather.data.name}, {weather.data.sys.country}
            </h2>
          </div>

          <div className="date">{formatDate(weather.data)}</div>

          <div className="weather-icon">
            <img
              src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
              alt={weather.data.weather[0].description}
            />
          </div>

          <div className="icon-temp">
            {Math.round(weather.data.main.temp)}
            <sup className="deg">°F</sup>
          </div>

          <div className="des-wind">
            <p>{weather.data.weather[0].description}</p>
            <p>Wind Speed: {weather.data.wind.speed} mph</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;