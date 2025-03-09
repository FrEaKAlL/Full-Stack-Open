const mongoose = require('mongoose')

let consulta = true
if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
} else if(process.argv.length === 5){
  consulta = false
}
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://sercal0121:${ password }@cluster0.gaqn7.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (consulta) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${ person.name } ${ person.number }`)
    })
    mongoose.connection.close()
  })
} else {
  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(result => {
    console.log(`added ${ result.name } ${ result.number } to phonebook`)
    mongoose.connection.close()
  })
}