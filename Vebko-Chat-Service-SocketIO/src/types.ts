export interface User {
  roomID: string
  UserName: string
}

export interface Message {
  roomID: string
  content: string
  date: string
  author: string
}

export interface Session {
  username: string
  session: string
  roomID: string
}
