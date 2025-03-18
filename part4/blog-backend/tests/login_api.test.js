const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const jwt = require('jsonwebtoken')

const config = require('../utils/config')

const helper = require('./test_helper')

//const bcrypt = require('bcrypt')
const User = require('../models/user')

describe('token is validated', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    await User.insertMany(await helper.initialUsers())
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.initialUsers()

    await api
      .post('/api/login')
      .send({ username: usersAtStart[1].username, password: 'salainen' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('valid token with id user', async () => {
    const usersAtStart = await helper.initialUsers()

    const respuesta = await api
      .post('/api/login')
      .send({ username: usersAtStart[1].username, password: 'salainen' })

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(jwt.verify(respuesta.body.token, config.SECRET).id, usersAtEnd[1].id)
  })
})

after(async () => {
  await mongoose.connection.close()
})