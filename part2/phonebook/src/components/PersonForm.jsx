import ElementForm from './ElementForm'

const PersonForm = ({ onAddPerson, elements }) => (
    <form onSubmit={ onAddPerson }>
        {
            elements.map(element => 
                <ElementForm key={ element.text } element={ element } />
            )
        }
        <div><button type="submit">add</button></div>
    </form>
)

export default PersonForm