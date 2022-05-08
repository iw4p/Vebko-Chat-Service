import React from 'react'


import { User } from '../utilities/types'

export interface Props {
  currentUser: User | null,
  users: User[],
  typingUsers: string[],
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, from: User |  null, to: string | null) => void
}


export const Sidebar: React.FC<Props> = ({ users, currentUser, typingUsers, onClick }) => {

return (
  <div className="lg:block max-w-md mx-auto bg-white rounded-xl shadow-md overflow-auto md:max-w-2xl">
    <div className="md:flex">
      <div className="md:shrink-0">
        <div className="h-48 w-full object-cover md:h-full md:w-60">
          <div>
            <h2 className="m-6 text-black font-bold text-lg">Users</h2>
            {users.map((user, i: number) => (
              
              <div
                key={`${user.UserName}-${i}`}
                className="p-3 mx-2 my-2 text-white text-opacity-70 bg-blue-dark rounded-md"
              >
                <button
                onClick={(e) => onClick(e, currentUser, user.UserName)}
                type="button"
                // className={`h-2 w-2 mr-2 rounded-full inline-block ${
                //   user.online ? 'bg-green-400' : 'bg-blue-light'
                //   // 'bg-green-400'
                // }`}
                >

                <div className="block mt-1 text-lg leading-tight flex items-center">
                  <div
                    className={`h-2 w-2 mr-2 rounded-full inline-block ${
                      user.online ? 'bg-green-400' : 'bg-blue-light'
                      // 'bg-green-400'
                    }`}
                  ></div>
                  {/* <button
                    onClick={onClick}
                    type="button"
                    className={`h-2 w-2 mr-2 rounded-full inline-block ${
                      user.online ? 'bg-green-400' : 'bg-blue-light'
                      // 'bg-green-400'
                    }`}
                  >
                  </button> */}
                  <span>{user.UserName}</span>
                  {user.UserName === currentUser!.UserName && (
                    <span className="ml-1 text-white text-opacity-30">(you)</span>
                  )}
                  {typingUsers.find(UserName => user.UserName === UserName) && (
                    <span className="ml-1 text-white text-opacity-50 italic"> typing...</span>
                  )}
                </div>
              </button>
              </div>
            ))}
          </div>
        </div>
    </div>
  </div>
</div>
  )
}