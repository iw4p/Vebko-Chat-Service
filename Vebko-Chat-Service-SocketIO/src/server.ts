import express, { Express, Request, response, Response } from 'express'
import axios from 'axios'
import * as http from 'http'
import * as socketio from 'socket.io'
import cors from 'cors'

import { User, Message, Session } from './types'
import { getUniqueUsersOnlineByUsername, getRoomIDByUsername } from './utilities'
import { PORT, CLIENT_HOST } from './config'


const app: Express = express()

// Set up http server and socket server
const server: http.Server = http.createServer(app)
const io: socketio.Server = new socketio.Server(server, {
  cors: {
    // origin: CLIENT_HOST,
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

app.use(cors())


let users: User[] = []
let currentUser:User;
let activeUserSessions: Session[] = []
let onlineUserNamesArray: any = []


let adminDict: Map<string, string> = new Map()

app.get('/api/allusers', (request: Request, response: Response) => {

  axios.get('http://192.168.0.2/api/ListofUser/ListofUser/All')
  .then(function (responses) {
    response.send(responses.data);
  })
  .catch(function (error) {
    response.send({ error })
  })
})

app.get('/api/users', (request: Request, response: Response) => {
  response.send({ users })
})


io.on('connection', (socket) => {
  const { id } = socket.client


  socket.on('sendMessage', (message: Message) => {
    io.in(message.roomID).emit('receiveMessage', message);
  })
  
  socket.on('setAllOnlineUser', (allUserJson: any) => {

    allUserJson = JSON.parse(allUserJson);

    let allUserJsonValues = Object.keys(allUserJson).map(key =>allUserJson[key])

    onlineUserNamesArray = allUserJsonValues

    io.emit('usersOnline', onlineUserNamesArray);

  });

  socket.on('setAllOnlineUserFromChatServer', (allUserJson: any) => {

    allUserJson = JSON.parse(allUserJson);

    let allUserJsonValues = Object.keys(allUserJson).map(key =>allUserJson[key])

    onlineUserNamesArray = allUserJsonValues

    io.emit('usersOnline', onlineUserNamesArray);

  })
  
  socket.on('callingSocket', (data: any) => {
    let adminID: string = adminDict.get('admin')!;
    io.in(adminID).emit('callingSocket', data);
  })

  socket.on('getAllUsersForClient', (user: User) => {

    axios.get('http://192.168.0.2/api/ListofUser/ListofUser/All').then(function (responses) {
    

    let found = responses.data.filter((response: any) => (response.UserName === user.UserName))

    if (found.length == 0) {
      return;
    }

      let adminID: string = adminDict.get('admin')!;
      currentUser = user;

      io.to(adminID).emit('getAllOnlineUser', '');


    socket.join(currentUser.roomID);

    if (!users.some((existingUser) => existingUser.UserName === currentUser.UserName)) {
      users = [...users, currentUser]
      socket.to(currentUser.roomID).emit('newUserAdded', currentUser);
    }

    socket.sessionUsername = currentUser.UserName
    activeUserSessions.push({
      session: id,
      username: currentUser.UserName,
      roomID: currentUser.roomID,
    })

    }).catch(function (error) {
      // handle error
      // io.emit(error)
    });

  });
  
  
  socket.on('setAdminSocket', (admin: string, adminId: string) => {
    adminDict.set(admin, adminId);
  })

  socket.on('disconnect', () => {
    activeUserSessions = activeUserSessions.filter(
      (user) => !(user.username === socket.sessionUsername && user.session === id)
    )
    let roomID = getRoomIDByUsername(activeUserSessions)
    socket.leave(roomID);
  })
})

app.set('port', PORT)
server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`)
})
