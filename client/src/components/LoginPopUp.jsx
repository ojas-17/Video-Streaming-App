import React from 'react'
import { usePopUpContext } from '../contexts/popUpContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faRightFromBracket, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faCircleQuestion, faMessage, faUser } from '@fortawesome/free-regular-svg-icons';
import ProfileMenuCard from './ProfileMenuCard';
import { useThemeContext } from '../contexts/themeContext';
import { useUserContext } from '../contexts/userContext';
import { Link, useLocation } from 'react-router-dom';

function LoginPopUp() {
    const { loginPopUp, setLoginPopUp } = usePopUpContext()
    const { theme } = useThemeContext()
    const { setUser, setPrevPage } = useUserContext()

    const location = useLocation()

    if (loginPopUp) return (
        <div className={`z-30 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 sm:w-1/2 lg:w-1/3 xl:w-1/4 p-5 rounded-lg flex flex-col gap-5 ${theme === 'light' ? 'bg-neutral-400' : 'bg-neutral-950'}`}>
            <div className='flex justify-between'>
                <div className=' text-2xl'>Login Required</div>
                {
                    location.pathname.includes('/watch') && (
                        <FontAwesomeIcon className=' cursor-pointer' icon={faXmark} size='2x' onClick={() => setLoginPopUp(false)} />
                    )
                }
            </div>
            {/* <div className='w-full h-px text-white'></div> */}
            <div className='text-lg'>
                Please Login to continue
            </div>
            <div className='flex justify-end mt-2'>
            <Link
                to={"/login"}
                className={`border-2 border-purple-600 hover:bg-purple-600 px-3 pb-1 text-2xl flex items-center justify-center transition-colors duration-100`}
                onClick={() => {
                    setPrevPage(location.pathname+location.search)
                    setLoginPopUp(false)
                }}
                >
                  Login
                </Link>
            </div>
        </div>
    )

    // console.log(account)

    return (
        <div>

        </div>
    )
}

export default LoginPopUp