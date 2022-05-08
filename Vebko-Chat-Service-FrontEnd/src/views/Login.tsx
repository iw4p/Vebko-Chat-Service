import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import logo from '../assets/vebko.png'
import { validateTextField, validateRoomID } from '../utilities/validation'
import { TextField } from '../components/TextField'
import { login } from '../store/auth.slice'

export interface FormFields {
  roomID: string
  username: string
}

export interface FormErrors {
  roomID?: string
  username?: string
}

export const Login: React.FC = () => {
  const [user, setUser] = useState<FormFields>({ roomID: '', username: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const dispatch = useDispatch()

  const validate = (name: string, value: string) => {
    switch (name) {
      case 'roomID':
        setErrors({ ...errors, [name]: validateRoomID(value) })
        break
      case 'username':
        setErrors({ ...errors, [name]: validateTextField(value) })
        break
    }
  }

  const isLoginButtonDisabled = () => {
    // Both login fields need to be filled out and free of errors before user can submit
    if (!user.roomID || !user.username) {
      return true
    }
    if (!!errors.roomID || !!errors.username) {
      return true
    }

    return false
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setUser({
      ...user,
      [name]: value,
    })

    if (errors[name as keyof FormErrors]) {
      validate(name, value)
    }
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    validate(name, value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    dispatch(login(user))

    // Instead of logging in user via actual persistent session, save in localStorage
    localStorage.setItem('user', JSON.stringify(user))
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="container bg-white m-4 p-12 w-500 text-center rounded-md shadow-lg max-w-full mx-auto">
        <img src={logo} className="block mx-auto mb-3 text-center w-24" alt="vebko" />

        <h1 className="text-3xl mb-8 font-bold text-gray-700">Vebko Live Chat Support</h1>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Room ID"
            name="roomID"
            value={user.roomID}
            placeholder="123-456-789"
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.roomID}
          />
          <TextField
            label="Username"
            name="username"
            value={user.username}
            placeholder="Vebko username"
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.username}
          />
          <div className="mb-3">
            <button
              className="w-full px-3 py-4 text-white bg-blue font-medium rounded-md shadow-md hover:bg-blue-dark disabled:opacity-50 focus:outline-none"
              disabled={isLoginButtonDisabled()}
            >
              Join Room
            </button>
          </div>
          <p className="text-center text-gray-400 text-sm">All rights reserved by Vebko.</p>
        </form>
      </div>
    </div>
  )
}
