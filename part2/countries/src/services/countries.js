import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries'

const getByName = (name) => axios.get(`${ baseUrl }/api/name/${ name }`).then(res => res.data)

const getAll = () => axios.get(`${ baseUrl }/api/all`).then(res => res.data)


export default { getByName, getAll }