import React, { useEffect, useState } from 'react'
import { MainWrapper } from './style.module'
import { CiSearch } from "react-icons/ci";
import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa";
import { BsSunFill,BsCloudFill,BsFillCloudRainFill,BsCloudFog2Fill } from "react-icons/bs";
import { RiLoaderFill } from "react-icons/ri";
import { TiWeatherPartlySunny } from "react-icons/ti";
import axios from 'axios';

interface weatherDataProps{
    name:string;
    main:{
        temp:number;
        humidity:number;
    };
    sys:{
        country:string;
    };
    weather:{
        main:string;
    }[];
    wind:{
        speed:number
    };
}


export default function DisplayWeather() {

    const api_key = "0cc86d16bf572f78cdc96c096c7627e5";
    const api_Endpoint = "https://api.openweathermap.org/data/2.5/";

    useEffect(()=>{
        navigator.geolocation.getCurrentPosition((position)=>{
            const {latitude,longitude} = position.coords;
            Promise.all([fetchWeather(latitude,longitude)]).then(
                ([currentWeather]) =>{
                    console.log(currentWeather)
                    setWeatherData(currentWeather)
                    setisLoading(false)
                }
            )
        })
    },[])
    const fetchWeather = async (lat:number,lon:number)=>{
        const url = `${api_Endpoint}weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`
        const response = await axios.get(url);
        return response.data
    }
    const fetchCurrentWeather = async (city:string)=>{
        try {
            const url = `${api_Endpoint}weather?q=${city}&appid=${api_key}&units=metric`;
            const searchResponse = await axios.get(url)
            const searchWeatherData:weatherDataProps = searchResponse.data
            return {searchWeatherData}  
        } catch (error) {
            alert("typo in your search")
            throw error
        }
    }

    const handleSearch = async () =>{
        if(searchCity.trim() === ""){
            return
        }
        try {
            const {searchWeatherData} = await fetchCurrentWeather(searchCity);
            setWeatherData(searchWeatherData)
            setisLoading(false)
        } catch (error) {
            console.log(error) 
        }
    }

    const [weatherData,setWeatherData] = useState<weatherDataProps|null>(null)
    const [isLoading,setisLoading] = useState(true)
    const [searchCity,setSearchCity] = useState<string>("")

    const iconChanger = (weather:string)=>{
        let iconElement:React.ReactNode;
        let iconColor:string
        switch(weather){
            case"Rain":
            iconElement = <BsFillCloudRainFill/>
            iconColor ="#272827"
            break;
            case"Clear":
            iconElement = <BsSunFill/>
            iconColor ="#272827"
            break;
            case"Clouds":
            iconElement = <BsCloudFill/>
            iconColor ="#272827"
            break;
            case"Mist":
            iconElement = <BsCloudFog2Fill/>
            iconColor ="#272827"
            break;
            default:
                iconElement = <TiWeatherPartlySunny/>
                iconColor ="#272827"
                break;
        }
        return (
            <span className='icon' style={{color:iconColor}}>{iconElement}</span>
        )
    }

  return (
    <MainWrapper>
       <div className="container">
        <div className="searchArea">
            <input onChange={((e)=>setSearchCity(e.target.value))} type='text' placeholder='enter the city'/>
            <div className="searchCircle">
                <CiSearch className="searchIcon" onClick={handleSearch}/>
            </div>
        </div> 

        {
            weatherData && isLoading === false ?(
                <>
                <div className="weatherArea">
                <h1>{weatherData.name}</h1>
                <span>{weatherData.sys.country}</span>
                <div className="icon">
                    {iconChanger(weatherData.weather[0].main)}
                </div>
                <h1>{weatherData.main.temp}</h1>
                <h2>{weatherData.weather[0].main}</h2>
            </div>
    
            <div className="bottomInfoArea">
                <div className="humidityLevel">
                    <WiHumidity className='windIcon'/>
                    <div className="humidInfo">
                        <h1>{weatherData.main.humidity}%</h1>
                        <p>Humidity</p>
                    </div>
                </div>
                <div className="wind">
                    <FaWind className='windIcon'/>
                    <div className="humidInfo">
                    <h1>{weatherData.wind.speed}km/h</h1>
                    <p>wind speed</p>
                </div>
              </div>
            </div>
            </>
            ):(
                <div className="loading">
                    <RiLoaderFill className='loadingIcon'/>
                    <p>loading</p>
                </div>
            )
        }
       </div>
    </MainWrapper>
  )
}
