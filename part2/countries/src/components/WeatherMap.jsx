const WeatherMap = ({ countri, weather }) => {
    if (countri === null){
        return null
    }
    if (weather === null){
        return null
    }
    return (<div>
        <h2>Weather in {countri.capital}</h2>
        <label>Temperature { (weather.main.temp - 273.15).toFixed(2) } Celsius</label>
        <br/>
        <img src={`https://openweathermap.org/img/wn/${ weather.weather[0].icon }@2x.png`} alt='icon weather' />
        <br/>
        <label>Wind { weather.wind.speed } m/s</label>
    </div>)
}
export default WeatherMap