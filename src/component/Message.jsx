import './style.css'

function Message({ message }) {
  return (
    <div className={`notification ${message.show ? 'show' : ''}`}>{message.value}</div>
  )
}

export default Message