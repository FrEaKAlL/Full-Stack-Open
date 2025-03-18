const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const Blog = require('../models/blog')

describe('tests for adding, deleting, updating, and querying', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    const initBlogs = await helper.initialBlogs()
    for (let blog of initBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })
  describe('test for adding', async () => {
    test('a valid blog can be added', async() => {
      const newBlog = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10
      }

      const users = await helper.usersInDb()
      const { username, id } = users[1]
      const token = jwt.sign({ username, id }, config.SECRET, { expiresIn: 60*60 })
      await api.post('/api/blogs')
        .send(newBlog)
        .set({ Authorization: `Bearer ${ token }` })
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const initBlogs = await helper.initialBlogs()
      assert.strictEqual(blogsAtEnd.length, initBlogs.length + 1)

      const contents = blogsAtEnd.map(n => n.title)
      assert(contents.includes('First class tests'))
    })
    test('a valid blog add missing token', async() => {
      const newBlog = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10
      }

      await api.post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)
    })
    test('validates the likes property for and if it does not exist, the property is added with a default value of 0', async () => {
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      }

      const users = await helper.usersInDb()
      const { username, id } = users[1]
      const token = jwt.sign({ username, id }, config.SECRET, { expiresIn: 60*60 })

      const response = await api.post('/api/blogs')
        .send(newBlog)
        .set({ Authorization: `Bearer ${ token }` })
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(typeof response.body.likes !== 'undefined', true)

      assert.strictEqual(response.body.likes, 0)
    })

    test('validate missing properties to return 400 bad request', async () => {
      const newBlog = {
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 10
      }

      const users = await helper.usersInDb()
      const { username, id } = users[1]
      const token = jwt.sign({ username, id }, config.SECRET, { expiresIn: 60*60 })

      await api.post('/api/blogs')
        .send(newBlog)
        .set({ Authorization: `Bearer ${ token }` })
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })
  })
  describe('test for updating', async () => {
    test('updated especific id change likes', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdated = blogsAtStart[0]
      blogToUpdated.likes = 20

      await api.put(`/api/blogs/${ blogToUpdated.id }`)
        .send(blogToUpdated)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd[0].likes, blogToUpdated.likes)
    })
  })
  describe('test for querying', () => {
    test('blogs are returned as json', async () => {
      await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')

      const initBlogs = await helper.initialBlogs()
      assert.strictEqual(response.body.length, initBlogs.length)
    })
    test('a specific blog is within the returned blogs', async () => {
      const response = await api.get('/api/blogs')

      const titles = response.body.map(r => r.title)
      assert(titles.includes('Go To Statement Considered Harmful'))
    })
    test('a blog requested by specific id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      const resultBlog = await api.get(`/api/blogs/${ blogToView.id }`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultBlog.body, blogToView)
    })
  })
  describe('property id', async () => {
    test('validation of id property in records', async () => {
      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual( typeof blogsAtEnd[0].id !== 'undefined', true)
    })
  })
  describe('test for delete', async () => {
    test('deleted especific id blog', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      const users = await helper.usersInDb()
      const { username, id } = users[1]
      const token = jwt.sign({ username, id }, config.SECRET, { expiresIn: 60*60 })

      await api.delete(`/api/blogs/${ blogToDelete.id }`)
        .set({ Authorization: `Bearer ${ token }` })
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const initBlogs = await helper.initialBlogs()
      assert.strictEqual(blogsAtEnd.length, initBlogs.length - 1)

      const titles = blogsAtEnd.map(r => r.title)
      assert(!titles.includes(blogToDelete.title))
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})