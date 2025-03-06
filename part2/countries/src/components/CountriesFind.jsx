const CountriesFind = ({ countriesFind, onShowCountrie }) => {
    if (countriesFind.length >= 10 ){
        return (<label>To many matches, specify another filter</label>)
    }
    if (countriesFind.length === 1){
        return null
    }
    return (
        countriesFind.map(countrie => (
            <div key={ countrie.name.common }>
                <label>
                    { countrie.name.common }
                </label>
                <button onClick={ () => onShowCountrie(countrie.name.common) }>show</button>
                <br/>
            </div>
        ))
    )
}
export default CountriesFind