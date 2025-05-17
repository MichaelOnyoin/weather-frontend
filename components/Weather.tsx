'use client'
import { useState } from 'react';
import axios from 'axios';
import { Wind, Sun, Thermometer, Droplets} from 'lucide-react'

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    pressure: number;
  };
  weather: { description: string; icon: string; }[];
  wind: { speed: number; deg: number };
  sys: { country: string; sunrise: number; sunset: number };
  timezone: number;
  }

export function Weather(){
  
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData>({} as WeatherData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=5903236a4f6da416d119d851a5de7b02`,
          );
      
      const data = await response.data;
      console.log(response.data);
      if (data.error) {
        throw new Error(data.error);
      }

      setWeather(response.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return(
    <div>
       {/* <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/rippleui@1.12.1/dist/css/styles.css"
        />
        <script src="https://cdn.tailwindcss.com"></script> */}
         <div className="text-2xl font-bold text-center mb-4">Weather App</div>
         <form className="flex justify-center mb-4 px-8" action={fetchWeather}>
            <input 
                className="focus:shadow-outline hover:text-gray-900 hover:bg-white rounded-xl text-xl shadow border-2 border-blue-900 "
  
                type="text"
                defaultValue={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
            />
            
            <button 
                className="active:shadow-3xl inline-flex w-fit rounded-lg 
                        bg-purple-10  py-2 px-4 text-sm font-semibold 
                        text-white shadow-lg transition-transform 
                        hover:bg-purple-500 hover:shadow-xl active:scale-95"
                        type="submit"
                onClick={fetchWeather}
                        >
                    Get Weather
                </button>

            {/* <button className='btn btn-primary' type="button">Hello</button> */}
            </form>    
       {loading && <p>Loading...</p>}
       {error && <p>Error: {error}</p>}
       {weather&&(

       
<div className="bg-white rounded-lg shadow-lg p-6 w-209 content-center">
    <div className="text-center text-xl font-bold text-gray-800 mb-4">{weather.name} Weather Forecast</div>
    <div className="flex justify-between items-center mb-4">
        <label className="text-gray-600"></label>  
        <input type="text"  
        placeholder={city}
        className="border border-orange-400 rounded-full px-3 py-1 text-gray-700 focus:outline-none" />
        
    </div>
    <div className="flex">
        <div className="flex-1 flex flex-col items-center justify-center border-r border-gray-200">
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="Weather icon" className="mb-2" />
            <div className="text-4xl font-bold text-gray-800">{weather.main.temp}°C</div>
            <div className="text-gray-600 text-xl">{weather.weather[0].description}</div>
            <div className="text-lg font-bold text-gray-700">{new Date().toLocaleString() + ''}</div>
           
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4 p-4">
            <div className="flex flex-col items-center">
                <div className="text-gray-600">Feels Like</div>
                <div className="text-xl font-bold text-gray-800">{weather.main.feels_like}°C</div>
               
                 <Thermometer className="text-orange-500"></Thermometer>                
            </div>
            <div className="flex flex-col items-center">
                <div className="text-gray-600">Wind</div>
                <div className="text-xl font-bold text-gray-800">{weather.wind.speed} m/s</div>
                
                <Wind className="fas fa-wind" style={{ color: "grey" }}>

                </Wind>
            </div>
            <div className="flex flex-col items-center">
                <div className="text-gray-600">Humidity</div>
                <div className="text-xl font-bold text-gray-800">{weather.main.humidity}%</div>
               
                
                <Droplets className="text-blue-500"></Droplets>
            </div>
            <div className="flex flex-col items-center">
                <div className="text-gray-600">Pressure</div>
                <div className="text-xl font-bold text-gray-800">{weather.main.pressure} mm</div>
                
            </div>
            <div className="flex flex-col items-center">
                <div className="text-gray-600">Country</div>
                <div className="text-xl font-bold text-gray-800">{weather.sys.country}</div>
                
            </div>
            <div className="flex flex-col items-center">
                <div className="text-gray-600">Sunset</div>
                <div className="text-xl font-bold text-gray-800">
                  {new Date((weather.sys.sunset+weather.timezone)*1000).toISOString().substring(11,16)}pm
                  {/* 
                  {new Date((weather.sys.sunrise+weather.timezone)*1000).toISOString().substring(11,16)}
                  {new Date()} */}
                  </div>
                
                <Sun className="text-orange-500"></Sun>
            </div>
        </div>
    </div>
</div>
)}
    </div>


  )
  
}