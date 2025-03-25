import { useState, useEffect, useRef } from 'react'
import Blog from './Blog'
import User from './User'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import PropTypes from 'prop-types'

const Blogs = ({ user, setUser, blogService, setErrorMessage, setSuccessMessage }) => {
  const [blogs, setBlogs] = useState([])
  const blogFomrRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs.sort((a, b) => {
        return b.likes - a.likes
      }))
    })
  }, [blogService, setBlogs])

  const incrementLikes = async (id, likes) => {
    const blogObjet = {
      likes: likes + 1
    }
    try {
      const returnedBlog = await blogService.update(id, blogObjet)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
    } catch(ex) {
      setErrorMessage('Ocurrio un error', ex.message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const removeBlog = async (blog) => {
    try {
      const { id, title } = blog
      if (window.confirm(`Remove blog ${ title }`)) {
        blogService.deleteBlog(id)
        setBlogs(blogs.filter((blog) => blog.id !== id))
      }
    } catch (ex) {
      setErrorMessage('Ocurrio un error', ex.response)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      <User user={ user } setUser={ setUser } />
      <Togglable buttonLabel="new note" ref={ blogFomrRef }>
        <BlogForm
          toggleVisibility={ () => blogFomrRef.current.toggleVisibility() }
          blogs={ blogs }
          setBlogs={ setBlogs }
          blogService={ blogService }
          setErrorMessage={ setErrorMessage }
          setSuccessMessage={ setSuccessMessage }  />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={ blog.id } user={ user } removeBlog={ removeBlog } incrementLikes={ incrementLikes } blog={ blog } />
      )}
    </div>
  )
}
Blogs.propTypes = {
  user: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
  blogService: PropTypes.object.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  setSuccessMessage: PropTypes.func.isRequired
}
export default Blogs