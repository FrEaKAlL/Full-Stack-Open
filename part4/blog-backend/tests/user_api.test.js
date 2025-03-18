const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const bcrypt = require('bcrypt')
const User = require('../models/user')

describe('when there is initially on user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })
  test('creation succeeds with a fresh username', async () => {
    const userAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api.post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const userAtEnd = await helper.usersInDb()
    assert.strictEqual(userAtEnd.length, userAtStart.length + 1)

    const usernames = userAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
  test('creation succeeds with a fresh username min length 3', async () => {
    const newUser = {
      username: 'usernew',
      name: 'Moral Salomon',
      password: 'sal'
    }

    await api.post('/api/users')
      .send(newUser)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})