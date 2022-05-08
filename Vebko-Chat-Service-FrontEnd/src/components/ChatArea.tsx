import React from 'react'
import dayjs from 'dayjs'

import { Message } from '../utilities/types'

export interface Props {
  messages: Message[]
  messageInput: string
  handleSubmitForm: (event: React.FormEvent<HTMLFormElement>) => void
  handleChangeInput: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const ChatArea: React.FC<Props> = ({
  messages,
  messageInput,
  handleSubmitForm,
  handleChangeInput,
}) => {
  return (
    <div className="flex-1 w-full bg-gray-100">
      <div className="flex flex-col chatarea">
        <div className="flex-1 overflow-y-auto p-6 flex flex-col-reverse">
          {messages.map((message, i) => (
            <div key={`${message.author}-${message.date}-${i}`} className="mb-3 p-3">
              <div className="flex items-center mb-2">
                <span className="font-bold text-gray-700 text-lg mr-4">{message.author}</span>{' '}
                <span className="text-sm text-gray-400">
                  {dayjs(message.date).format('h:mm A')}
                </span>
              </div>
              <p className="text-gray-800">{message.content}</p>
            </div>
          ))}
        </div>
        <div className="pb-4 px-4 container mx-auto">

          <form onSubmit={handleSubmitForm}>
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">Search</label>
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg className="w-6 h-6 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
            </div>
            <input
              type="text"
              name="messageInput"
              autoComplete="off"
              value={messageInput}
              onChange={handleChangeInput}
              className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Reply..."
            />
            <button type="submit" className="text-white text-opacity-70 bg-blue-dark rounded-md absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Send</button>
            {/* <button className="show">Send</button> */}
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}
