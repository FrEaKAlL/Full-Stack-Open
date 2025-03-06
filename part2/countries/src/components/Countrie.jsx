const Countrie = ({ countrie }) => {
    if (!countrie){
        return null
    }
    return (
        <div>
            <h1>{ countrie.name.common }</h1> 
            <label>Capital { countrie.capital }</label> 
            <br/>
            <label>Area { countrie.area }</label> 
            <br/>
            <h1>Languages</h1>
            <ul>
                {
                    Object.entries(countrie.languages).map((lng) => (
                        <li key={ lng[0] }>{ lng[1] }</li>
                    ))
                }
            </ul>
            <img src={ countrie.flags.png } alt={ countrie.flags.alt } />
        </div>
    )
}
export default Countrie