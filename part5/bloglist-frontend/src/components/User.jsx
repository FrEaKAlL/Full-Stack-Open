import PropTypes from 'prop-types'

const User = ({ user, setUser }) => {
  const loginOut = (event) => {
    event.preventDefault()
    window.localStorage.clear()
    setUser(null)
  }
  return (
    <p>
      { user.name }
      <button onClick={ loginOut } >logout</button>
    </p>
  )
}
User.propTypes = {
  user: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired
}
export default User