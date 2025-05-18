'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Wind,  Droplets, Search} from 'lucide-react';

interface WeatherData {
  list: {
    dt_txt: string;
    main: { temp: number; humidity: number };
    weather: { main: string; icon: string }[];
    wind: { speed: number; deg: number };
  }[];
  city: {
    name: string;
  };
}

export const Forecast = () => {
    const [city, setCity] = useState<string>('Nairobi');
    const [data, setData] = useState<WeatherData | null>(null);
    const [unit, setUnit] = useState<"metric" | "imperial">("metric");
    

    const fetchData = async () => {
    //const backendUrl = `http://localhost:8000/api/weather?city=${city}&units=${unit}`;
    //const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${apiKey}`;
    //const res = await axios.get(url);
    const backendUrl = `https://weather-backend-master-bkxef2.laravel.cloud/api/weather?city=${city}&units=${unit}`;
    const res = await axios.get(backendUrl);
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, [unit]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short" });

  const dailyForecast = data?.list.filter((_, i) => i % 8 === 0); // every 24h (8 x 3h)

  const today = data?.list[0];

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl mx-auto mt-10">
            {/* Top: Search and Unit Toggle */}
            <div className="flex justify-between items-center mb-6">
            <div className="text-xl font-bold text-slate-800 text-center">{city} Weather Forecast</div>
            <div className="flex items-center gap-2">
                <form className="flex justify-center mb-4 px-8" action={fetchData}>
                <input
                type="text"
                defaultValue={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Search city..."
                className="border border-orange-400 rounded-full px-3 py-1 text-gray-700 focus:outline-none"
                /></form>
                <button onClick={fetchData} className="flex rounded-md p-2 hover:bg-green-400">
                <Search className="text-blue-500 hover:text-white" role="button" />
                </button>
                <button
                onClick={() => setUnit(unit === "metric" ? "imperial" : "metric")}
                className="text-orange-700 font-semibold rounded-md p-2 hover:bg-orange-200 transition duration-300"
                >
                {unit === "metric" ? "°C" : "°F"}
                </button>
            </div>
            </div>

            {today && (
            <div className="grid grid-cols-4 gap-8">
                {/* Left: Today's Weather */}
                <div className="col-span-1 flex flex-col items-center justify-center border-r border-gray-200 pr-6">
                <img
                    src={`https://openweathermap.org/img/wn/${today.weather[0].icon}@2x.png`}
                    alt="Weather icon"
                    className="mb-2 w-24 h-24"
                />
                <div className="text-4xl font-bold text-gray-800">
                    {Math.round(today.main.temp)}°{unit === "metric" ? "C" : "F"}
                </div>
                <div className="text-xl text-gray-600">{today.weather[0].main}</div>
                <div className="text-md text-slate-700 mt-2 text-center">
                    {new Date(today.dt_txt).toLocaleDateString()}<br />{data?.city.name}
                </div>
                </div>

                {/* Right: Forecast and Details */}
                <div className="col-span-3 flex flex-col gap-6">
                {/* 3 Day Forecast */}
                <div>
                    <div className="text-lg font-semibold text-slate-700 mb-2 text-center ">3 Day Forecast</div>
                    <div className="grid grid-cols-3 gap-4 text-slate-700">
                    {dailyForecast?.slice(0, 3).map((day, i) => (
                        <div key={i} className="card p-4 shadow-md rounded-md bg-white flex flex-col items-center">
                        <div className="text-sm font-semibold">{formatDate(day.dt_txt)}</div>
                        <img
                            src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                            alt="icon"
                            className="w-16 my-2"
                        />
                        <div className="text-center">
                            <div>{day.weather[0].main}</div>
                            <div className="text-lg text-gray-800">
                            {Math.round(day.main.temp - 3)} - {Math.round(day.main.temp + 3)}°
                            {unit === "metric" ? "C" : "F"}
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>

                {/* Bottom: Wind and Humidity */}
                <div className="grid grid-cols-2 gap-6 mt-2">
                    {/* Wind Status */}
                    <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center shadow">
                    <div className="text-gray-600 mb-2">Wind Status</div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                        {today.wind.speed} km/h
                    </div>
                    <Wind className="text-gray-400" />
                    <div className="text-md mt-1 text-slate-700">Direction: {today?.wind.deg}°</div>
                    {/* Optionally add wind direction */}
                    </div>
                    {/* Humidity */}
                    <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center shadow">
                    <div className="text-gray-600 mb-2">Humidity</div>
                    <div className="text-2xl font-bold text-gray-800 mb-1 ">
                        {today.main.humidity}%
                    </div>
                    <progress
                        className="text-blue-300 w-full mt-2 progress"
                        value={today.main.humidity}
                        max="100"
                    />
                    <Droplets className="text-blue-500 mt-2" />
                    </div>
                </div>
                </div>
            </div>
            )}
        </div>
);
}