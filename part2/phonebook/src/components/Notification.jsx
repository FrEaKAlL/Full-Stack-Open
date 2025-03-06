const Notification = ({ message, successMessage }) => {
  let typeMessage = 'success'
  let finalMessage = successMessage
  if (message === null && successMessage === null) {
    return null
  }else if (message !== null && successMessage === null){
    typeMessage = 'error'
    finalMessage = message
  }


  return (
    <div className={`notification ${ typeMessage }`}>
      { finalMessage }
    </div>
  )
}

export default Notification