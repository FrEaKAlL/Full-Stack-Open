const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => logger.error('error connecting to MongoDB:', error.message))

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
if (config.NODE_ENV !== 'test') {
  app.use(middleware.morgan(':method :url :status :res[content-length] - :response-time ms :body'))
}
app.use(middleware.tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

if (config.NODE_ENV !== 'test'){
  app.use(middleware.errorHandler)
}

module.exports = app