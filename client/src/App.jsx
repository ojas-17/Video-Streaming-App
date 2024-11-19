import React, { useEffect, useState } from 'react'
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import VideoPage from './components/VideoPage';
import { Outlet } from 'react-router-dom'
import { useThemeContext } from './contexts/themeContext';
import { useUserContext } from './contexts/userContext';

function App() {

  const [sidebar, setSidebar] = useState(false)

  const toggleSidebar = () => {
    setSidebar((prev) => !prev)
  }

  const closeSidebar = () => {
    if (sidebar)
      setSidebar(false)
  }

  const { theme } = useThemeContext()
  const { setUser } = useUserContext()

  useEffect(() => {
    const url1 = `${import.meta.env.VITE_BACKEND_URL}/users/current-user`
    const url2 = `${import.meta.env.VITE_BACKEND_URL}/users/refresh-token`
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      credentials: 'include'
    }

    fetch(url2, options)
      .then((res) => res.json())
      .catch((err) => console.log('2', err))

    fetch(url1, options)
      .then((res) => res.json())
      .then((res) => {
        if (res?.data)
          setUser(res.data)
      })
      .catch((err) => console.log('1', err))

  }, [])

  return (
    <div className={`flex flex-col items-center w-full min-h-screen transition-colors duration-200 ${theme === 'light' ? 'bg-neutral-100' : 'bg-neutral-800'} ${theme === 'light' ? 'text-black' : 'text-white'}`}>
      <Sidebar sidebar={sidebar} toggleSidebar={toggleSidebar} />

      {
        sidebar && (
          <div className='w-full h-full fixed top-0 left-0 bg-black opacity-40 z-30' onClick={closeSidebar}></div>
        )
      }

      <Header toggleSidebar={toggleSidebar} />
      {/* <h1 className='text-5xl pt-10'>Video</h1> */}
      <Outlet />
      {/* <VideoPage  closeSidebar={closeSidebar}/> */}
    </div>
  )
}

export default App
