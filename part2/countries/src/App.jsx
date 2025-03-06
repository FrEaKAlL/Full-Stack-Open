import { useState, useEffect } from 'react'
import Search from "./components/Search"
import Countrie from "./components/Countrie"
import CountriesFind from './components/CountriesFind'
import WeatherMap from './components/WeatherMap'
import ServiceCountries from './services/countries'
import ServiceWeather from './services/weather'

const App = () => {
  const [newSearch, setNewSearch] = useState('')
  const [countrie, setCountrie] = useState(null)
  const [countries, setCountries] = useState([])
  const [weatherCountri, setWeatherCountri] = useState(null)
  const [countriesFind, setCountriesFind] = useState([])

  useEffect(() => {
    if (countrie) {
      ServiceWeather
        .getWeather(countrie.latlng[0], countrie.latlng[1])
        .then(res => {
          setWeatherCountri(res)
        })
    } else {
      ServiceCountries
        .getAll()
        .then(res => {
          setCountries(res)
        })
    }
  }, [countrie])

  const searchCountrie = (event) => {
    const valFilter = event.target.value
    setNewSearch(valFilter)
    setCountrie(null)
    const countriesFind = countries.filter((x) => x.name.common.toLowerCase().includes(valFilter.toLowerCase()))
    if (countriesFind.length === 1){
      setCountrie(countriesFind[0])
    }
    setCountriesFind(countriesFind)
  }

  const onShowCountrie = (name) => {
    setCountriesFind([])
    const countri = countries.find((x) => x.name.common.toLowerCase().includes(name.toLowerCase()))
    setCountrie(countri)
  }

  return (
    <div>
      <Search text='find countries' textSearch={ newSearch } onSearchCountrie={ searchCountrie } />
      <CountriesFind countriesFind={ countriesFind } onShowCountrie={ onShowCountrie } />
      <Countrie countrie={ countrie } />
      <WeatherMap countri={ countrie } weather={ weatherCountri }/>
    </div>
  )
}

export default App
