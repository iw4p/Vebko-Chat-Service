import { Dispatch } from 'redux'

import { addMessage } from '../store/messages.slice'
import { addUser, removeTypingUser, setOnlineUsersByUsername, setTypingUser } from '../store/users.slice'
import { Message, User, RootState } from '../utilities/types'

interface SocketMiddlewareParams {
  dispatch: Dispatch
  getState: () => RootState
}

export default function socketMiddleware(socket: any) {
  return (params: SocketMiddlewareParams) => (next: any) => (action: any) => {
    const { dispatch } = params
    const { type, payload } = action

    switch (type) {
      // Connect to the socket when a user logs in
      case 'users/login': {
        socket.connect()

        socket.on('connect', ()=> {
          socket.emit('getAllUsersForClient', payload)
        })

        // Append a user every time a new one is registered


        // Set up all the socket event handlers
        // When these events are received from the socket, they'll dispatch the proper Redux action

        // Update the online users list every time a user logs in or out
        socket.on('usersOnline', (onlineUsers: string[]) => {
          dispatch(setOnlineUsersByUsername(onlineUsers))
        })

        // Append a message every time a new one comes in
        socket.on('receiveMessage', (message: Message) => {
          dispatch(addMessage(message));
        })

        socket.on('test', (message: Message) => {
          dispatch(addMessage(message));
        })

        // Remove if some user stops typing
        socket.on('user stopped typing...', (username: string)=>{
          dispatch(removeTypingUser(username));
        })

        // Add if some user starts typing
        socket.on('user starts typing...', (username: string) => {
          dispatch(setTypingUser(username));
        })

        // Append a user every time a new one is registered
        socket.on('newUserAdded', (user: User) => {
          dispatch(addUser(user))
        })

        // Add the current user to the online users list
        // socket.emit('newLogin', payload)
        break
      }

      // Telling the sever that this user is typing...
      case 'users/sendThisUserIsTyping': {
        socket.emit('typing...', payload)
        break
      }

      // Telling the server that this user stopped typing..
      case 'users/sendThisUserStoppedTyping': {
        socket.emit('stopped typing...', payload)
        return
      }

      // Disconnect from the socket when a user logs out
      case 'users/logout': {
        socket.disconnect()

        break
      }
      // Let the server be the source of truth for all messages; don't dispatch anything
      case 'messages/sendMessage': {
        socket.emit('sendMessage', payload)
        return
      }
      case 'messages/callingSocket': {
        socket.emit('callingSocket', payload)
        return
      }
    }

    return next(action)
  }
}
