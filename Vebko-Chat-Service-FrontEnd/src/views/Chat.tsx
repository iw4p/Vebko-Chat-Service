import React, { useMemo, useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import _ from 'lodash'

import { Nav } from '../components/Nav'
import { Sidebar } from '../components/Sidebar'
import { ChatArea } from '../components/ChatArea'
import { sendMessage, getMessages, callingSocket } from '../store/messages.slice'
import {sendThisUserIsTyping, sendThisUserStoppedTyping} from '../store/users.slice'
import { logout } from '../store/auth.slice'
// import { getUsers, getAllUsers } from '../store/users.slice'
import { getAllUsers } from '../store/users.slice'
import { RootState, Message } from '../utilities/types'

export const Chat: React.FC = () => {
  const dispatch = useDispatch()
  const [messageInput, setMessageInput] = useState('')

  const { currentUser } = useSelector((state: RootState) => state.authState)
  const { users, loading: usersLoading, onlineUsersByUsername, typingUsers } = useSelector(
    (state: RootState) => state.usersState
  )
  const { messages, loading: messagesLoading } = useSelector(
    (state: RootState) => state.messagesState
  )

  const handleStartChatClick = (event: any, from: any, to: any) => {

    var tempProps = JSON.parse(JSON.stringify(from));
    tempProps.to = to;
    Object.preventExtensions(tempProps);

    dispatch(callingSocket(tempProps))

  }
  
 // Debounce the typing indication emit
  const debouncedTypingIndicationEmit = useCallback(
    _.debounce(() => dispatch(sendThisUserIsTyping(currentUser!.UserName)), 500),
    [], // will be created only once initially
  );

  const handleSubmitForm = (event: any) => {
    event.preventDefault()

    if (messageInput && messageInput.trim() !== '') {
      const message: Message = {
        roomID: currentUser!.roomID,
        content: messageInput.trim(),
        date: dayjs().format(),
        author: currentUser!.UserName,
      }

      dispatch(sendThisUserStoppedTyping(currentUser!.UserName))
      dispatch(sendMessage(message))

    }

    setMessageInput('')
  }
// To remove typing indicator when messageInput changes to empty string
  useEffect(()=>{
    if(messageInput===''){
      dispatch(sendThisUserStoppedTyping(currentUser!.UserName))

      //Handles the last debounced emit
      setTimeout(()=>{
        dispatch(sendThisUserStoppedTyping(currentUser!.UserName))
      },500)
    }
  }, [messageInput, currentUser,dispatch])

  const handleChangeInput = (event: any) => {
    if (event.target.value !== '') debouncedTypingIndicationEmit();

    setMessageInput(event.target.value)
  }

  useEffect(() => {
    // dispatch(getUsers())
    dispatch(getAllUsers())
    // dispatch(getMessages())
  }, [dispatch])

  // Add green dot for online users
  const usersWithOnlineData = useMemo(() => {
    if (users.length < 1) {
      return []
    }
    return users
      .map((user) => ({
        ...user,
        online: onlineUsersByUsername.some((onlineUsername) => onlineUsername === user.UserName),
      }))
      .sort((a, b) => a.UserName.localeCompare(b.UserName))
  }, [users, onlineUsersByUsername])

  // Add green dot for online users
  const reversedMessages = useMemo(() => {
    if (messages.length < 1) {
      return []
    }

    return [...messages].reverse()
  }, [messages])

  if (messagesLoading || usersLoading) {
    return <div className="flex justify-center items-center h-screen bg-gray-100">Loading...</div>
  }

  return (
    <>
      <Nav />
      {/* <Sidebar users={usersWithOnlineData} currentUser={currentUser} typingUsers={typingUsers} onClick={handleStartChatClick} /> */}
      <div className="flex m-0 content">
        <Sidebar users={usersWithOnlineData} currentUser={currentUser} typingUsers={typingUsers} onClick={handleStartChatClick} />
        <ChatArea
          messages={reversedMessages}
          messageInput={messageInput}
          handleSubmitForm={handleSubmitForm}
          handleChangeInput={handleChangeInput}
        />
      </div>
    </>
  )
}
