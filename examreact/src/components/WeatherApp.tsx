import React, { useState } from 'react';
import axios from 'axios';

interface WeatherData {
  city: {
    name: string;
    country: string;
  };
  list: {
    dt: number;
    dt_txt: string;
    main: {
      temp: number;
      humidity: number;
    };
    weather: [
      {
        id: number;
        main: string;
        description: string;
        icon: string;
      }
    ];
    wind: {
      speed: number;
    };
  }[];
}

const WeatherApp: React.FC = () => {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = '78eed15a40899a776a085301e70513b9'; 

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${API_KEY}&units=metric`
      );
      const filteredData = response.data.list.filter((forecast) => {
        
        const date = new Date(forecast.dt * 1000);
        const hours = date.getHours();
        return hours === 6 || hours === 18;
      });
      setWeather({ ...response.data, list: filteredData });
      setError(null);
    } catch (err) {
      setError('Місто не знайдено');
      setWeather(null);
    }
  };
  
  



  const handleSearch = () => {
    if (query) {
      fetchWeatherData();
    }
  };

  return (
    <div>
      
      <h1>Прогноз погоди</h1>
      <div className='search-container'>
      <input
        type="text"
        placeholder="Вкажите місто"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Пошук</button>
      </div>
      {error && <p>{error}</p>}
      {weather && (
        <div className='main'>
          <h2>{weather.city.name}, {weather.city.country}</h2>



          <div className='main'>
            
          {weather.list.map((forecast) => (
            <div key={forecast.dt} className='card'>
              <p>Дата: {new Date(forecast.dt * 1000).toLocaleDateString()}</p>
              <p>Час: {new Date(forecast.dt * 1000).toLocaleTimeString()}</p>
              <p>Температура: {forecast.main.temp}°C</p>
              <p>Вологість: {forecast.main.humidity}%</p>
              <p>Швидкість вітру: {forecast.wind.speed} м/с</p>
              <p>Погодні умови: {forecast.weather[0].description}</p>
              <img
                src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                alt={forecast.weather[0].description}
              />
            </div>
            
          ))}
        </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
