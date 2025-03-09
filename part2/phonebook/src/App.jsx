import { useState, useEffect } from 'react'
import PersonsServer from './services/persons'

import Title from './components/Title'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    PersonsServer
      .getAll()
      .then(registros => {
        setPersons(registros)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.find((person) => person.name === newName)){
      if(window.confirm(`${ newName } is already added to phonebook, replace the old number with a new one?`)){
        const person = persons.find((person) => person.name === newName)
        const changePerson = { ... person, number: newNumber }
        PersonsServer
          .update(person.id, changePerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
            setNewName('')
            setNewNumber('')
            setSuccessMessage(`Replace number of ${ returnedPerson.name }`)
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
          })
          .catch(error => {
            setErrorMessage(error.response.data.error)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      }
      PersonsServer
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(`Added ${ personObject.name }`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        }) 
        .catch(error => {
          console.log(error)
          setErrorMessage(error.response.data.error)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
        })
    }
  }

  const headlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const headleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const filterValueChange = (event) => {
    setFilterValue(event.target.value)
  }

  const PersonsToShow = filterValue === '' ? persons : persons.filter(x => x.name.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase()))

  const elements = [
    {
      text: 'name',
      value: newName,
      onElementChange: headlePersonChange
    },
    {
      text: 'number',
      value: newNumber,
      onElementChange: headleNumberChange
    }
  ]

  const onDeletePersonOf = (id) => {
    const person = persons.find((person) => person.id === id)
    PersonsServer
      .deletePerson(id)
      .then(res =>{
        setPersons(persons.filter(x => x.id !== person.id))
        setSuccessMessage(`${ person.name } removed`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
      .catch(error => {
        setErrorMessage(`${ person.name } removed`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  return (
    <div>
      <Title text='Phonebook'/>
      <Notification message={ errorMessage } successMessage={ successMessage } />
      <Filter text='filter shown with' filterValue={ filterValue } onChangeFilter={ filterValueChange } />

      <Title text='Add a new'/>
      <PersonForm onAddPerson={ addPerson } elements={ elements } />
      
      <Title text='Numbers'/>
      <Persons personsToShow={ PersonsToShow } onDeletePerson={ onDeletePersonOf } />
    </div>
  )
}

export default App