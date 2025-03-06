import Person from './Person'
const Persons = ({ personsToShow, onDeletePerson }) => (
    <>
        { personsToShow.map(person => 
            <Person key={ person.id } person={ person } onDeletePersonOf={() => onDeletePerson( person.id )} />
        )}
    </>
)

export default Persons