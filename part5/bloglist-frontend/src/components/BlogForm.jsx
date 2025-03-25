import PropTypes from 'prop-types'
import { useState } from 'react'

const BlogForm = ({ toggleVisibility, blogs, setBlogs, blogService, setErrorMessage, setSuccessMessage }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleAddBlog = async (event) => {
    event.preventDefault()
    try {
      const blogObject = {
        title,
        author,
        url
      }
      const returnedBlog = await blogService.create(blogObject)
      toggleVisibility()
      setSuccessMessage(`a new blog ${ returnedBlog.title } added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      setBlogs(blogs.concat(returnedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (ex) {
      setErrorMessage('Ocurrio un error', ex.message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  return (
    <form onSubmit={ handleAddBlog }>
      <div>
            title:
        <input
          type='text'
          value={ title }
          id='title'
          data-testid='title'
          name='title'
          onChange={ ({ target }) => setTitle(target.value) }
        />
      </div>
      <div>
            author:
        <input
          type='text'
          value={ author }
          id='author'
          data-testid='author'
          name='author'
          onChange={ ({ target }) => setAuthor(target.value) }
        />
      </div>
      <div>
            url:
        <input
          type='text'
          value={ url }
          id='url'
          data-testid='url'
          name='url'
          onChange={ ({ target }) => setUrl(target.value) }
        />
      </div>
      <button type='submit'>create</button>
    </form>
  )
}
BlogForm.propTypes = {
  toggleVisibility: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired,
  setBlogs: PropTypes.func.isRequired,
  blogService: PropTypes.object.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  setSuccessMessage: PropTypes.func.isRequired
}
export default BlogForm