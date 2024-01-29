import { useState, useEffect } from 'react'
import personService from './services/persons'

const Person = (props) => {
  return(
    <div>
      {props.name} {props.number}
      <button onClick={() => props.del(props.id, props.name)} type="submit">delete</button>
    </div>
  )
}

const PersonForm = (props) => {
  return(
  <form onSubmit={props.submitname}>
    <div>
    name: <input
      value={props.name}
      onChange={props.onchange} 
    ></input>
    </div>
    <div>
    number: <input
      value={props.phonenumber}
      onChange={props.numberchange}
    >
    </input>
    </div>
    <div>
      <button type="submit">add</button>
      <div>debug: {props.name}</div>
    </div>
  </form>
  )
}

const AllPersons = (props) => {
  return(
    <ul>
      {props.persons.map(person =>
        <li key={person.name}>
          <Person name={person.name} number={person.number} id={person.id} del={props.del}/>
        </li>)}
      </ul>
  )
}

const Filter = (props) => {
  return(
    <div>
      filteröi: <input
        value={props.value}
        onChange = {props.onchange}
      ></input>
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="alert">
      {message}
    </div>
  )
}


const App = () => {
  
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState("")
  const [newFilter, setNewFilter] = useState("")
  const [alertMessage, setAlertMessage] = useState(null)

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const deleteName = (id, name) => {
    console.log(id, name)
    personService
      .remove(id)
      .then(response => {
        console.log(response)
        confirm(`Delete ${name}`)
          ? (setPersons(persons.filter((person) => person.id != id)),
            setAlertMessage(
              `Person '${name}' was successfully removed from server`
            ),
            setTimeout(() => {
              setAlertMessage(null)
            }, 5000))
          : null
      })
      
  }

  const addName = (event) => {     
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }
    console.log(persons.some(person => person.name === newName))
    if (persons.some(person => person.name === newName)) {
      const oldperson = persons.find((person) => person.name === newName)
      return (
        confirm(`${newName} is already added to phonebook. Replace the old number with a new one?`)
          ? personService
            .replace(nameObject, oldperson.id)
            .catch(error => {
              setAlertMessage(
                `Information of '${oldperson.name}' has already been removed from server`
              ),
              setPersons(persons.filter(n => n.id !== oldperson.id))
            })
            .then(response => {
              console.log(response)
              const index = persons.indexOf(oldperson);
              if (index > -1) { 
                persons.splice(index, 1)
              setPersons(persons.concat(response.data))
              } 
              setAlertMessage(
                `Person '${newName}''s number was successfully changed to server`
              ),
              setTimeout(() => {
                setAlertMessage(null)
              }, 5000)
            })
          : setAlertMessage(
            `Person '${newName}'' is already in phonebook`
          ),
          setTimeout(() => {
            setAlertMessage(null)
          }, 5000)
      )
    }
    else {
      personService
        .create(nameObject)
        .then(response => {
          setPersons(persons.concat(response.data))
      console.log(response)
      console.log(persons)
    })
    }
    setNewName("")
    setNewNumber("")
    console.log("button clicked", event.target)
    setAlertMessage(
      `Person '${newName}' was successfully added to server`
    ),
    setTimeout(() => {
      setAlertMessage(null)
    }, 5000)
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={alertMessage}/>
      <Filter value={newFilter} onchange={handleFilterChange}/>
      <h3>Add a new</h3>
      <PersonForm submitname={addName} name={newName} onchange={handleNameChange} phonenumber={newNumber} numberchange={handleNumberChange}/>
      <h2>Numbers</h2>
      <AllPersons persons={persons.filter(person => person.name.includes(newFilter))} del={deleteName}/>
    </div>
  )

}

export default App