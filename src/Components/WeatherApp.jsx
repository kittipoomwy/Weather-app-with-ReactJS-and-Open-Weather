import 'bootstrap/dist/css/bootstrap.min.css';
import './WeatherApp.css'
import loadingGif from '../assets/images/loading.gif'
import sunny from '../assets/images/sunny.png';
import cloudy from '../assets/images/cloudy.png';
import rainy from '../assets/images/rainy.png';
import snowy from '../assets/images/snowy.png';
import haze from '../assets/images/haze.png';
import mist from '../assets/images/mist.png';
import { useState, useEffect } from 'react';

function WeatherApp() {
    const [data, setData] = useState({});
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);

    const apiKey = ""; // Enter your API key here

    const handleInputChange = (event) => {
        setLocation(event.target.value);
    }

    const search = async () => {
        if (location.trim() !== "") {

            const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=Metric&appid=${apiKey}`;
            const res = await fetch(url);
            const searchResult = await res.json();
            if (searchResult.cod !== 200) {
                setData({notFound: true});
            }
            else {
                setData(searchResult);
                setLocation("");
            }
        }

        setLoading(false);
    }

    useEffect(() => {
        const fetchDefaultWeather = async () => {
            setLoading(true);
            const defaultLocation = "Thailand";
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&units=Metric&appid=${apiKey}`;
            const res = await fetch(url);
            const defaultWeather = await res.json();
    
            setData(defaultWeather);
            setLoading(false);
        }

        fetchDefaultWeather();
    }, []);

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            search();
        }
    }

    const weatherImages = {
        Clear: sunny,
        Clouds: cloudy,
        Rain: rainy,
        Snow: snowy,
        Haze: haze,
        Mist: mist
    };

    const weatherImage = data.weather && weatherImages[data.weather[0].main]

    const backgroundStyles = {
        Clear: 'linear-gradient(to right, #fbbb6c, #fddb73)',
        Clouds: 'linear-gradient(to right, #b7c8d6, #e0e6eb)',
        Rain: 'linear-gradient(to right, #7ca7ce, #e0e6eb)',
        Snow: 'linear-gradient(to right, #e3fffa, #ffffff)',
        Haze: 'linear-gradient(to right, #b7c8d6, #e0e6eb)',
        Mist: 'linear-gradient(to right, #b7c8d6, #e0e6eb)'
    }

    const backgroundStyle = data.weather ? backgroundStyles[data.weather[0].main] : 'linear-gradient(to right, #fbbb6c, #fddb73)';

    const currentDateTime = new Date();

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthsOfYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const dayOfWeek = daysOfWeek[currentDateTime.getDay()];
    const dayOfMonth = currentDateTime.getDate();
    const monthOfYear = monthsOfYear[currentDateTime.getMonth()];
    const time = `${currentDateTime.getHours()}:${currentDateTime.getMinutes() < 10 ? "0" + currentDateTime.getMinutes() : currentDateTime.getMinutes()} ${currentDateTime.getHours() >= 12 ? "PM" : "AM"}`;

    const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${monthOfYear} ${time}`;

  return (
    <div className="container" style={{background: backgroundStyle}}>
      <div className="weather-app" style={{background: backgroundStyle && backgroundStyle.replace("to right", "to top")}}>
        <div className="search">
            <div className="search-top">
                <i className="fa-solid fa-location-dot"></i>
                <div className="location">{data.name}</div>
            </div>
            <div className="search-bar">
                <input type="text" placeholder="Enter Location" value={location} onChange={handleInputChange} onKeyDown={handleKeyPress} />
                <i className="fa-solid fa-magnifying-glass" onClick={search}></i>
            </div>
        </div>
        { loading 
        ? (<img className="loading" src={loadingGif} alt="loading" />) 
        :   data.notFound 
            ? <div className="not-found">Location not found</div> 
            :   <>
                    <div className="weather">
                        <img src={weatherImage} alt="sunny" />
                        <div className="weather-type">{data.weather && data.weather[0].main}</div>
                        <div className="temperature">{data.main && `${Math.floor(data.main.temp)}°`}</div>
                    </div>
                    <div className="weather-date">
                        <div className="date">{formattedDate}</div>
                    </div>
                    <div className="weather-data">
                        <div className="humidity">
                            <div className="data-name">Humidity</div>
                            <i className="fa-solid fa-droplet"></i>
                            <div className="data">{data.main && data.main.humidity} %</div>
                        </div>
                        <div className="wind">
                            <div className="data-name">Wind</div>
                            <i className="fa-solid fa-wind"></i>
                            <div className="data">{data.wind && `${data.wind.speed}`} km/hr</div>
                        </div>
                    </div>
                </>
        }
      </div>
    </div>
  )
}

export default WeatherApp