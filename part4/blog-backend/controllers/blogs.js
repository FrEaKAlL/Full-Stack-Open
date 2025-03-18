const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
    .populate('user', { username: 1, name: 1 })
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  if (!body.title) {
    return response.status(400).json({ error: 'title missing' })
  }
  if (!body.author) {
    return response.status(400).json({ error: 'author missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: (typeof body.likes !== 'undefined' ? body.likes : 0),
    user: user.id
  })

  const saveBlog = await blog.save()
  user.blogs = user.blogs.concat(saveBlog._id)
  await user.save()
  response.status(201).json(saveBlog)
})
blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
    .populate('user', { username: 1, name: 1 })

  if (blog.user.id !== request.user.id){
    return response.status(400).json({ error: 'you cannot delete a blog that does not belong to the token user.' })
  }
  await Blog.findByIdAndDelete(request.params.id)
  return response.status(204).end()
})
blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { likes }, { new: true, runValidators: true, context: 'query' })
  response.json(updatedBlog)
})
module.exports = blogsRouter