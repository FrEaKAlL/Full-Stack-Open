const Filter = ({ text,onChangeFilter, filterValue}) => (
    <div>
        { text } 
        <input type='text' value={ filterValue } onChange={ onChangeFilter } />
    </div>
)

export default Filter