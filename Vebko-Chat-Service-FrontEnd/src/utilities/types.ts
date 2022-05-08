// =======================================================================================
// User
// =======================================================================================

// export interface User {
//   // email: string
//   roomID: string
//   username: string
//   online?: boolean
// }
export interface User {
  email?: string
  roomID: string
  ProfileID?: string
  UserName: string
  Name?: string
  Family?: string
  online: boolean
}

export interface UsersState {
  users: User[]
  onlineUsersByUsername: string[]
  loading: boolean
  error: string | null,
  typingUsers: string[]
}

// =======================================================================================
// Messages
// =======================================================================================

export interface Message {
  roomID: string
  content: string
  date: string
  author: string
}

export interface MessagesState {
  messages: Message[]
  loading: boolean
  error: string | null
}

// =======================================================================================
// Store
// =======================================================================================

export interface AuthState {
  currentUser: User | null
  isAuthenticated: boolean
  error: string | null
}

export interface RootState {
  authState: AuthState
  usersState: UsersState
  messagesState: MessagesState
}
