import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faClockRotateLeft, faFire, faGear, faHome, faRectangleList, faUsersRectangle } from '@fortawesome/free-solid-svg-icons';
import { faCircleQuestion, faMessage } from '@fortawesome/free-regular-svg-icons';
import { BsCollectionPlay } from "react-icons/bs";
import { FaRegRectangleList } from "react-icons/fa6";
import { useThemeContext } from '../contexts/themeContext';
import { Link, NavLink } from 'react-router-dom';
import SidebarMenuCard from './SidebarMenuCard';
import { useUserContext } from '../contexts/userContext';

function Sidebar({ sidebar, toggleSidebar }) {

  const { theme } = useThemeContext()
  const { user } = useUserContext()

  return (
    <div
      className={`h-screen w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 fixed left-0 z-40 transition-transform transform duration-500 ${sidebar ? 'translate-x-0' : '-translate-x-full'} ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-950'}`}
    // onClick={toggleSidebar}
    >
      <div className='w-full h-20 flex items-center justify-between px-5'>
        <Link to={"/"}>
          <img className='aspect-auto w-20' src="http://res.cloudinary.com/daz3h4k3g/image/upload/v1731426491/d7a13o6gu1t8o7lfrfmw.png" alt="" />
        </Link>
        <FontAwesomeIcon
          icon={faBars}
          size='2x'
          className='cursor-pointer'
          onClick={toggleSidebar}
        />
      </div>
      <nav className='p-4'>
        <SidebarMenuCard to='/'>
          <FontAwesomeIcon icon={faHome} />
          <span>Home</span>
        </SidebarMenuCard>

        <SidebarMenuCard to='/trending'>
          <FontAwesomeIcon icon={faFire} />
          <span>Trending</span>
        </SidebarMenuCard>
        <SidebarMenuCard to='/history'>
          <FontAwesomeIcon icon={faClockRotateLeft} />
          <span>History</span>
        </SidebarMenuCard>
        <SidebarMenuCard to='/liked-videos'>
          <BsCollectionPlay size='23'/>
          <span>Liked Videos</span>
        </SidebarMenuCard>
        <SidebarMenuCard to='/subscriptions'>
          <FontAwesomeIcon icon={faUsersRectangle} />
          <span>Subscriptions</span>
        </SidebarMenuCard>
        <SidebarMenuCard to={`${user?.username ? `/channel/${user.username}` : '/login'}`}>
          {/* <FontAwesomeIcon icon={faRectangleList} /> */}
          <FaRegRectangleList size='24'/>
          <span>Your Channel</span>
        </SidebarMenuCard>

        <div className={`w-full h-px mt-4 mb-2 ${theme === 'light' ? 'bg-black' : 'bg-white'}`}></div>

        <SidebarMenuCard to='/error'>
          <FontAwesomeIcon icon={faGear} />
          <span>Settings</span>
        </SidebarMenuCard>
        <SidebarMenuCard to='/error'>
          <FontAwesomeIcon icon={faCircleQuestion} />
          <span>Help</span>
        </SidebarMenuCard>
        <SidebarMenuCard to='/error'>
          <FontAwesomeIcon icon={faMessage} />
          <span>Feedback</span>
        </SidebarMenuCard>
      </nav>
    </div>
  )
}

export default Sidebar