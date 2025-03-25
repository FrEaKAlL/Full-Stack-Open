import { useState } from 'react'
import Blogs from './components/Blogs'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [user, setUser] = useState(null)

  return (
    <div>
      <Notification message={ errorMessage } successMessage={ successMessage } />
      { user === null ?
        <LoginForm  blogService={ blogService } setUser={ setUser } setErrorMessage={ setErrorMessage } /> :
        <Blogs user={ user } setUser={ setUser } blogService={ blogService } setErrorMessage={ setErrorMessage } setSuccessMessage={ setSuccessMessage }/>
      }
    </div>
  )
}

export default App