import { useState, useEffect } from 'react'
import loginService from '../services/login'
import PropTypes from 'prop-types'

const LoginForm = ({ blogService, setUser, setErrorMessage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    } else {
      setUser(null)
    }
  }, [blogService, setUser])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (e) {
      setErrorMessage(e.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      <h1>log in to application</h1>
      <form onSubmit={ handleLogin }>
        <div>
          unsername
          <input
            type='text'
            value={ username }
            data-testid='username'
            name='Username'
            onChange={ ({ target }) => setUsername(target.value) }
          />
          <br />
          <br />
          password
          <input
            type='password'
            value={ password }
            data-testid='password'
            name='Password'
            onChange={ ({ target }) => setPassword(target.value) }
          />
        </div>
        <br />
        <button type='submit'>login</button>
      </form>
    </div>
  )
}
LoginForm.propTypes = {
  blogService: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired
}
export default LoginForm