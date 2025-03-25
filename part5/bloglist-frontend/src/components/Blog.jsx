import PropTypes from 'prop-types'
import { useState } from 'react'

const Blog = ({ user, blog, removeBlog, incrementLikes }) => {
  const [showAll, setShowAll] = useState(false)
  let display = { display: showAll ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleShowAll = () => {
    setShowAll(!showAll)

    display = { display: showAll ? '' : 'none' }
  }

  return (
    <div className='blog' style={ blogStyle }>
      {blog.title} { showAll ? '' : blog.author } <button onClick={ toggleShowAll } >{ showAll ? 'hide' : 'view' }</button>
      <div className='details' style={ display }>
        { blog.url }
        <br/>
        likes { blog.likes } <button onClick={ () => incrementLikes(blog.id, blog.likes) } >like</button>
        <br/>
        { blog.author }
        <br/>
        { user.username === blog.user.username && <button className='eliminar' onClick={ () => removeBlog(blog) }>eliminar</button> }
      </div>
    </div>
  )
}
Blog.porpTypes = {
  user: PropTypes.object.isRequired,
  blog: PropTypes.object.isRequired,
  removeBlog: PropTypes.func.isRequired,
  incrementLikes: PropTypes.func.isRequired
}
export default Blog