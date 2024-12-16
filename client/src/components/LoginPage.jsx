import React, { useState } from 'react'
import { useThemeContext } from '../contexts/themeContext'
import { useUserContext } from '../contexts/userContext'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { MdSunny } from "react-icons/md";


function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const [error, setError] = useState('')

  const { theme, setTheme } = useThemeContext()
  const { setUser, prevPage } = useUserContext()

  const navigate = useNavigate()

  const toggleTheme = () => {
    setTheme((prev) => prev === 'light' ? 'dark' : 'light')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username) {
      setError("Username is required")
      setTimeout(() => {
        setError('')
      }, 2000);
    }
    else if (!password) {
      setError("Password is required")
      setTimeout(() => {
        setError('')
      }, 2000);
    }

    else {
      const url = `${import.meta.env.VITE_BACKEND_URL}/users/login`
      const data = {
        username,
        password
      }
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      }

      fetch(url, options)
        .then((res) => {
          if (res.status === 404) {
            setError("Username not found")
            setTimeout(() => {
              setError('')
            }, 2000);
          }
          else if (res.status === 401) {
            setError("Incorrect Password")
            setTimeout(() => {
              setError('')
            }, 2000);
          }
          return res.json()
        })
        // .then((res) => console.log(res))
        .then((res) => {
          // console.log(res)
          setUser(res.data.user)
          // console.log(prevPage)
          navigate(prevPage)
        })
        .catch((err) => console.log(err))
    }
  }

  return (
    <div className={`w-full min-h-screen flex flex-col gap-10 p-0 sm:p-10 justify-center items-center transition-colors duration-200 ${theme === 'light' ? 'bg-neutral-200' : 'bg-neutral-700'}`}>
      
      <div onClick={toggleTheme} className='fixed top-0 right-0 cursor-pointer m-5'>
        {
          theme === 'dark' ? (
            <FontAwesomeIcon
              className={`aspect-[1/1] transition-colors  duration-100 ${isHovered ? 'text-purple-600' : 'text-white'}`}
              icon={faMoon}
              size='2x'
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
          ) : (
            <MdSunny
              className={`text-4xl transition-colors duration-100 ${isHovered ? 'text-purple-600' : ''}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
          )
        }
      </div>

      <div className={`fixed -top-10 left-1/2 -translate-x-1/2 text-white ${theme === 'light' ? 'bg-red-500' : 'bg-red-700'} p-2 sm:px-5 py-2 rounded-full transition-transform duration-300 ${error ? 'translate-y-20' : ''}`}>
        {error}
      </div>

      <img className='aspect-auto w-60 hidden sm:block shadow-lg shadow-purple-500' src="http://res.cloudinary.com/daz3h4k3g/image/upload/v1731426491/d7a13o6gu1t8o7lfrfmw.png" alt="" />

      <div className={`flex flex-col items-center sm:rounded-3xl shadow-xl shadow-purple-500 w-full sm:w-5/6 md:w-2/3 lg:w-1/2 xl:w-1/3 h-screen sm:h-full transition-colors duration-200 ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-800'} ${theme === 'light' ? 'text-black' : 'text-white'} sm:px-10 py-20 sm:py-10 gap-12`}>
        <img className='aspect-auto w-60 block sm:hidden shadow-lg shadow-purple-500' src="http://res.cloudinary.com/daz3h4k3g/image/upload/v1731426491/d7a13o6gu1t8o7lfrfmw.png" alt="" />
        <form onSubmit={handleSubmit} className='w-10/12 sm:w-3/4 flex flex-col items-center gap-12'>
          <h1 className='text-4xl'>Login</h1>

          <div className='flex flex-col gap-8'>
            <div>
              <label htmlFor="">Enter Username</label>
              <input
                type="text"
                className={`w-full p-2 rounded-lg text-xl focus:shadow-md focus:shadow-purple-500 transition-shadow duration-200 placeholder-neutral-500 outline-none ${theme === 'light' ? 'bg-neutral-400' : 'bg-neutral-900'}`}
                placeholder='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="">Enter Password</label>
              <input
                type="text"
                className={`w-full p-2 rounded-lg text-xl focus:shadow-md focus:shadow-purple-500 transition-shadow duration-200 placeholder-neutral-500 outline-none ${theme === 'light' ? 'bg-neutral-400' : 'bg-neutral-900'}`}
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className='w-full flex flex-col justify-center items-center gap-3'>
            <button
              className={`text-2xl border-2 border-purple-600 transition-colors duration-100 hover:bg-purple-600 pb-2 pt-1 px-3`}
            >
              Login
            </button>
            <span>
              Don't have an account? <Link to='/signup' className='underline text-purple-500'>Create an Account</Link>
            </span>
          </div>

        </form>
      </div>

    </div>
  )
}

export default LoginPage