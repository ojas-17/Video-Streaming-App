import React, { useState } from 'react'
import { useThemeContext } from '../contexts/themeContext'
import { useUserContext } from '../contexts/userContext'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  
  const { theme } = useThemeContext()
  const { setUser, prevPage } = useUserContext()

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const url = `${import.meta.env.VITE_BACKEND_URL}/users/login`
    const data = {
      username,
      password
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify(data)
    }
    
    fetch(url, options)
    .then((res) => res.json())
    // .then((res) => console.log(res))
    .then((res) => {
      console.log(res)
      setUser(res.data.user)
      navigate(prevPage)
    })
    .catch((err) => console.log(err))
  }

  return (
    <div className={`flex flex-col items-center w-full h-screen ${theme === 'light' ? 'bg-neutral-100' : 'bg-neutral-800'} ${theme === 'light' ? 'text-black' : 'text-white'} py-10 gap-10`}>
      <img className='aspect-auto w-60' src="http://res.cloudinary.com/daz3h4k3g/image/upload/v1731426491/d7a13o6gu1t8o7lfrfmw.png" alt="" />
      <form onSubmit={handleSubmit} className='w-1/4 flex-col items-center gap-10 h-full mt-10'>
        <div>
          <label htmlFor="">Username</label>
          <input
            type="text"
            className={`w-full p-2 rounded-lg mb-10 ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-900'}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="">Password</label>
          <input
            type="text"
            className={`w-full p-2 rounded-lg mb-10 ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-900'}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className='w-full flex justify-center'>
          <button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`text-2xl border-2 border-purple-600 transition-colors duration-100 ${isHovered ? 'bg-purple-600' : ''} pb-2 pt-1 px-3`}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  )
}

export default LoginPage