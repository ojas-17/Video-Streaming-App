import React, { useState } from 'react'
import { useThemeContext } from '../contexts/themeContext'
import { useUserContext } from '../contexts/userContext'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { MdSunny } from "react-icons/md";


function SignUpPage() {
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg');

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set the image preview
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const { theme, setTheme } = useThemeContext()
  const { setUser, prevPage } = useUserContext()

  const navigate = useNavigate()

  const toggleTheme = () => {
    setTheme((prev) => prev === 'light' ? 'dark' : 'light')
  }

  const loginUser = async (username, password) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fullName) {
      setError("Name is required")
      setTimeout(() => {
        setError('')
      }, 2000);
    }
    else if (!username) {
      setError("Username is required")
      setTimeout(() => {
        setError('')
      }, 2000);
    }
    else if (!email) {
      setError("Email is required")
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
      const url = `${import.meta.env.VITE_BACKEND_URL}/users/register`

      const formData = new FormData()
      formData.append('fullName', fullName)
      formData.append('username', username)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('avatar', image)

      const options = {
        method: 'POST',
        body: formData
      }

      fetch(url, options)
        .then((res) => res.json())
        // .then((res) => console.log(res))
        .then((res) => {
          if (res.statusCode < 400) {
            //setMsg
            setMsg(res.message)
            setTimeout(() => {
              setMsg('')
              loginUser(username, password)
            }, 2000);
            
          }
          else {
            console.log(res)
            setError(res.message)
            setTimeout(() => {
              setError('')
            }, 2000);
          }
        })
        .catch((err) => console.log(err))
    }
  }

  return (
    <div className={`w-full min-h-screen flex flex-col gap-10 p-0 sm:p-10 justify-center items-center transition-colors duration-200 ${theme === 'light' ? 'bg-neutral-200' : 'bg-neutral-700'}`}>

      <div onClick={toggleTheme} className='fixed z-10 top-0 right-0 cursor-pointer m-5'>
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

      <div className={`fixed w-3/4 sm:w-fit text-center z-20 -top-10 left-1/2 -translate-x-1/2 text-white ${theme === 'light' ? 'bg-red-500' : 'bg-red-700'} px-2 sm:px-5 py-2 rounded-full transition-transform duration-300 ${error ? 'translate-y-20' : ''}`}>
        {error}
      </div>

      <div className={`fixed w-3/4 sm:w-fit text-center z-20 -top-10 left-1/2 -translate-x-1/2 ${theme === 'light' ? 'bg-green-400 text-black' : 'bg-green-600 text-white'} px-2 sm:px-5 py-2 rounded-full transition-transform duration-300 ${msg ? 'translate-y-20' : ''}`}>
        {msg}
      </div>

      <img className='aspect-auto w-60 hidden sm:block shadow-lg shadow-purple-500' src="http://res.cloudinary.com/daz3h4k3g/image/upload/v1731426491/d7a13o6gu1t8o7lfrfmw.png" alt="" />

      <div className={`flex flex-col items-center sm:rounded-3xl shadow-xl shadow-purple-500 w-full sm:w-5/6 md:w-2/3 lg:w-5/6 xl:w-5/6 sm:h-full transition-colors duration-200 ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-800'} ${theme === 'light' ? 'text-black' : 'text-white'} sm:px-10 py-20 sm:py-10 gap-12`}>
        <img className='aspect-auto w-60 block sm:hidden shadow-lg shadow-purple-500' src="http://res.cloudinary.com/daz3h4k3g/image/upload/v1731426491/d7a13o6gu1t8o7lfrfmw.png" alt="" />
        <form onSubmit={handleSubmit} className='w-10/12 sm:w-full flex flex-col items-center gap-12'>
          <h1 className='text-4xl'>Sign Up</h1>

          <div className='w-full flex flex-wrap justify-evenly items-center gap-10 lg:gap-0'>

            <div className='relative w-full lg:w-[40%] xl:w-1/3 flex flex-col gap-5 justify-center items-center'>
              {/* <label htmlFor="file-input" className={`file-label absolute flex items-center gap-2 p-2 rounded-lg cursor-pointer ${theme === 'light' ? 'bg-neutral-500' : 'bg-neutral-950'}`}>
                <FontAwesomeIcon icon={faPenToSquare} />
                <span>{image ? image.name : 'Choose File'}</span>
              </label> */}
              <input
                type="file"
                accept='image/*'
                id='file-input'
                onChange={handleImageChange}
                style={{ display: 'none' }}
                className='absolute'
              />

              {imagePreview && (
                <label htmlFor='file-input' className='relative w-full rounded-full cursor-pointer border-4 border-purple-500 '>
                  {/* <div className='absolute z-10 w-full h-full rounded-full bg-black opacity-0 hover:opacity-30'></div> */}
                  <div className={`absolute w-full h-full text-white rounded-full flex justify-center items-center transition-all duration-100 bg-black bg-opacity-0 hover:bg-opacity-40 `}>
                    <span className={`w-full h-full flex justify-center items-center rounded-full transition-all duration-100 opacity-0 hover:opacity-100 ${imagePreview === 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg' ? 'opacity-100' : ''}`}>
                      {/* <span className='bg-black bg-opacity-50 py-1 px-2 rounded-lg'>{image ? image.name : 'Choose File'}</span> */}
                      <span className='bg-black bg-opacity-50 py-1 px-2 flex items-center gap-2 rounded-lg'>
                        <FontAwesomeIcon icon={faPenToSquare} />
                        Choose File
                      </span>
                    </span>
                  </div>
                  <img className='aspect-[1/1] w-full h-full rounded-full' src={imagePreview} alt="" />
                </label>
              )}

              <div className='text-lg'>Profile Picture</div>
            </div>

            <div className='w-full sm:w-5/6 md:w-3/4 lg:w-[46%] xl:w-1/3 flex flex-col gap-8'>
              <div>
                <label htmlFor="">Enter Name</label>
                <input
                  type="text"
                  className={`w-full p-2 rounded-lg text-xl focus:shadow-md focus:shadow-purple-500 transition-shadow duration-200 placeholder-neutral-500 outline-none ${theme === 'light' ? 'bg-neutral-400' : 'bg-neutral-900'}`}
                  placeholder='Full Name'
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

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
                <label htmlFor="">Enter Email</label>
                <input
                  type="text"
                  className={`w-full p-2 rounded-lg text-xl focus:shadow-md focus:shadow-purple-500 transition-shadow duration-200 placeholder-neutral-500 outline-none ${theme === 'light' ? 'bg-neutral-400' : 'bg-neutral-900'}`}
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
          </div>

          <div className='w-full flex flex-col justify-center items-center gap-3'>
            <button className={`text-2xl border-2 border-purple-600 transition-colors duration-100 hover:bg-purple-600 pb-2 pt-1 px-3`}>
              Create Account
            </button>
            <span>
              Already have an account? <Link to='/login' className='underline text-purple-500'>Login Here</Link>
            </span>
          </div>

        </form>
      </div>

    </div>
  )
}

export default SignUpPage