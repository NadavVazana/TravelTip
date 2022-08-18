// import { axios } from "../lib/axios"
const WEATHER_KEY = '4a3499cb809dc6f971bd4e0c1979a3ec'
export const weatherService = {
    getWeather
}


function getWeather(lat, lng) {
    return axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=${WEATHER_KEY}`)
        .then(res => {
            return {
                desc: res.data.weather[0].description,
                temp: res.data.main.temp,
                feels: res.data.main.feels_like,
                icon: res.data.weather[0].icon,
                humid: res.data.main.humidity,
                city: res.data.name,
                country: res.data.sys.country,
            }
        })
}