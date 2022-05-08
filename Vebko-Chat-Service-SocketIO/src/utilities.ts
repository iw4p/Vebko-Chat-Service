import { Session } from './types'

// Helpers
export function getUniqueUsersOnlineByUsername(activeUserSessions: Session[]) {
  return [...new Set(activeUserSessions.map((userSession) => userSession.username))]
}

export function getRoomIDByUsername(activeUserSessions: Session[]) {
  return [...new Set(activeUserSessions.map((userSession) => userSession.roomID))]
}
