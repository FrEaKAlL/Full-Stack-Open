const Search = ({ text, textSearch, onSearchCountrie }) => {
    return (
        <div>
            { text }
            <input 
                type='text'
                value={ textSearch }
                onChange={ onSearchCountrie }
            />
        </div>
    )
}
export default Search