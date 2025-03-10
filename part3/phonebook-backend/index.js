require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const app = express()
const Person = require('./models/person')

morgan.token('body', req => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))
app.use(express.json())

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const htmlResponse = `Phonebook has info for ${ persons.length } people<br /><br />${ new Date() }`
    response.send(htmlResponse)
  })
})
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(person)
    })
})
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      console.log('elemento borrado', result.id)
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (!body.name && !body.number) {
    return response.status(400).json({ error: 'name and number is required' })
  } else if (!body.name && body.number) {
    return response.status(400).json({ error: 'name is required' })
  } else if (body.name && !body.number) {
    return response.status(400).json({ error: 'number is required' })
  }

  const personNew = new Person ({
    name: body.name,
    number: body.number
  })

  personNew.save().then(savePerson => {
    response.json(savePerson)
  })
    .catch(error => next(error))
})
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})
const errorHandler = (error, request, response, next) => {
  console.error('mensaje de error', error.name)
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => console.log(`Server running on port ${ PORT }`))