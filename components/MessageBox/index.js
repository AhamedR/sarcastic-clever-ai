import { useEffect, useRef, useState } from 'react'
import axios from 'axios';

import styles from '../../styles/messageBox/index.module.scss'

const MessageBox = () => {
  const [messageHistory, setMessageHistory] = useState([{id: 'user', message: 'Hi'},{id: 'robot', message: 'Hello'}])
  const [message, setMessage] = useState('')
  const [isBotThinking, setIsBotThinking] = useState(false)
  const messageListRef = useRef(null)

  const test= messageListRef.current
  useEffect(() => {
    scrollBottom()
  }, [messageHistory])

  const handleMessage = (event) => {
    setMessage(event.target.value)
  }

  const scrollBottom = () => {
    messageListRef.current.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }

  const onSubmit = (event) => {
    event.stopPropagation()
    event.preventDefault()
    const newMessage = event.target.message.value

    if (!newMessage.trim()) {
      return
    }

    messageHistory.push({id: 'user', message: newMessage})
    setMessageHistory([...messageHistory])
    setMessage('')
    setIsBotThinking(true)

    axios.post('/api/reply', { data: { message: newMessage, messageHistory} })
      .then(function (response) {
        // handle success
        if (response && response.data) {
          messageHistory.push({
            id: 'robot',
            message: response.data.reply,
          })
          setMessageHistory([...messageHistory])
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsBotThinking(false)
      });
  }

  return (
    <>
      <div className={styles.messages}>
        <ul className={styles.messageList} ref={messageListRef}>
          {messageHistory.map((message, index) =>
            <li
              className={[styles.message, message.id === 'user' ? styles.user: styles.robot].join(' ')}
              key={index}
            >
              {message.message}
            </li>
          )}
        </ul>
      </div>
      <form onSubmit={onSubmit} className={styles.messageForm}>
        {isBotThinking && <p>Bot is Typing...</p>}
        <div className={styles.messageInputContainer}>
          <input className={styles.messageBox} type='text' name='message' value={message} onChange={handleMessage} autoComplete="off" />
          <button className={styles.submit} type='submit'>Send</button>
        </div>
      </form>
    </>
  )
}

export default MessageBox
