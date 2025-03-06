const Person = ({ person, onDeletePersonOf }) => {
    return (
        <div>
            { person.name } { person.number }
            <button onClick={() => { 
                if (window.confirm(`Delete ${ person.name }`)) {
                    onDeletePersonOf()
                }}}>delete</button>
        </div>
    )
}

export default Person