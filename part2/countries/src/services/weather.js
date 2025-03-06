import axios from 'axios'
console.log(`https://api.openweathermap.org/data/2.5/weather?q=Finland&appid=${ import.meta.env.VITE_SOME_KEY }`)

const getWeather = (lat, lon) => axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${ import.meta.env.VITE_SOME_KEY }`).then(res => res.data)

export default { getWeather }