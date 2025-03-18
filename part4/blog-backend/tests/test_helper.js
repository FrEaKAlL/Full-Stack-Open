const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

const blogsInDb = async () => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
  return blogs.map(blog => blog.toJSON())
}
const usersInDb = async () => {
  const users = await User.find({})
  // .populate('blogs')
  return users.map(user => user.toJSON())
}
const initialUsers = async () => {
  const initialUsersVar = [
    {
      username: 'root',
      passwordHash: await bcrypt.hash('sekret', 10)
    },
    {
      username: 'mluukkai',
      passwordHash: await bcrypt.hash('salainen', 10)
    }
  ]
  return initialUsersVar
}
const initialBlogs = async () => {
  const users = await usersInDb()
  const initialBlogsVar = [
    {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      user: users[1].id
    },
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      user: users[1].id
    }
  ]
  return initialBlogsVar
}

module.exports = { initialBlogs, initialUsers, blogsInDb, usersInDb }