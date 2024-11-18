import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faMagnifyingGlass, faMoon } from '@fortawesome/free-solid-svg-icons';
import { faSun } from '@fortawesome/free-regular-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useThemeContext } from '../contexts/themeContext';
import { useUserContext } from '../contexts/userContext';
import { usePopUpContext } from '../contexts/popUpContext';
import AccountPopUp from './AccountPopUp';
import LoginPopUp from './LoginPopUp';


function Header({ toggleSidebar }) {
  const [searchText, setSearchText] = useState('')
  const [isHovered1, setIsHovered1] = useState(false)
  const [isHovered2, setIsHovered2] = useState(false)
  const [isHovered3, setIsHovered3] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const search = () => {
    if (searchText) {
      const text = searchText
      setSearchText('')
      navigate(`/search?query=${text}`)
    }
  }

  const { theme, setTheme} = useThemeContext()
  const { user, setUser, prevPage, setPrevPage } = useUserContext()
  const { account, setAccount, loginPopUp, setLoginPopUp } = usePopUpContext()
  // console.log(user)

  const toggleTheme = () => {
    setTheme((prev) => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <div className=''>
      <div className='w-full h-20 pl-5 pr-10 flex items-center justify-between'>

        <div>
          <div onClick={toggleSidebar} className='cursor-pointer'>
            <FontAwesomeIcon icon={faBars} size='2x' />
          </div>
          <div>
            
          </div>
        </div>

        <div className='w-1/3'>Search</div>
        <div>Account</div>

      </div>

      <div className={`w-full h-20 fixed top-0 left-0 z-20 transition-colors duration-200 ${theme === 'light' ? 'bg-neutral-100' : 'bg-neutral-800'} pl-5 pr-10 flex items-center justify-between`}>

        <div className='flex gap-4 items-center'>
          <div onClick={toggleSidebar} className='cursor-pointer'>
            <FontAwesomeIcon icon={faBars} size='2x' />
          </div>
          <Link to={"/"}>
            <img className='aspect-auto w-20' src="http://res.cloudinary.com/daz3h4k3g/image/upload/v1731426491/d7a13o6gu1t8o7lfrfmw.png" alt="" />
          </Link>
        </div>

        <div className='w-1/3 flex relative items-center'>
          <input
            className={`w-full transition-colors duration-200 ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-900'} px-4 py-2 rounded-xl text-xl outline-none`}
            type="text"
            placeholder='Search'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                search()
              }
            }}
          />
          <button
          onClick={search}
          className='absolute right-0 px-2 py-1'
          onMouseEnter={() => setIsHovered1(true)}
          onMouseLeave={() => setIsHovered1(false)}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} className='transition-colors duration-100' style={{ color: isHovered1 ? "#822eff" : theme === 'light' ? 'black' : 'white' }} size='2x' />
          </button>
        </div>

        <div className='flex items-center gap-5'>
          <div onClick={toggleTheme} className='cursor-pointer'>
            <FontAwesomeIcon
            className={`aspect-[1/1] transition-colors duration-100 ${isHovered2 ? 'text-purple-600' : ''}`}
            icon={theme === 'light' ? faMoon : faSun}
            size='2x'
            onMouseEnter={() => setIsHovered2(true)}
            onMouseLeave={() => setIsHovered2(false)}
            />
          </div>
          <div>
            {
              Object.keys(user).length !== 0 && (
                <div className='cursor-pointer' onClick={() => {setAccount((prev) => {
                  // console.log(prev)
                  return !prev
                })}}>
                  <img src={user.avatar} className='aspect-[1/1] w-12 rounded-full object-cover border-2 border-purple-600' alt="" />
                </div>
              )
            }
            {
              Object.keys(user).length === 0 && (
                <Link
                to={"/login"}
                className={`border-2 border-purple-600 px-3 pb-1 text-2xl flex items-center justify-center transition-colors duration-100 ${isHovered3 ? 'bg-purple-600' : ''}`}
                onMouseEnter={() => setIsHovered3(true)}
                onMouseLeave={() => setIsHovered3(false)}
                onClick={() => setPrevPage(location.pathname+location.search)}
                >
                  Login
                </Link>
              )
            }
          </div>
        </div>

      </div>

      <div>
        <AccountPopUp />
      </div>

      {
        account && (
          <div className='fixed w-full h-full left-0 top-0 z-20' onClick={() => setAccount(false)}>

          </div>
        )
      }
      
      <div>
        <LoginPopUp />
      </div>

      {
        loginPopUp && (
          <div className='fixed w-full h-full left-0 top-0 z-20' onClick={() => setLoginPopUp(false)}>

          </div>
        )
      }

    </div>
  )
}

export default Header