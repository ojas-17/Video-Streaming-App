import React from 'react'
import { usePopUpContext } from '../contexts/popUpContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faCircleQuestion, faMessage, faUser } from '@fortawesome/free-regular-svg-icons';
import ProfileMenuCard from './ProfileMenuCard';
import { useThemeContext } from '../contexts/themeContext';
import { useUserContext } from '../contexts/userContext';
import { Link } from 'react-router-dom';

function AccountPopUp() {
    const { account, setAccount } = usePopUpContext()
    const { theme } = useThemeContext()
    const { setUser } = useUserContext()

    const logoutUser = async () => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/users/logout`
        const options = {
            method: 'POST',
            credentials: 'include'
        }

        fetch(url, options)
        .then((res) => res.json())
        .catch((err) => console.log(err))
    }

    if (account) return (
        <div className={`z-30 right-0 fixed w-1/2 sm:w-1/3 lg:w-1/5 px-3 py-3 rounded-lg flex flex-col ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-900'} mx-5 text-xl`}>
            <Link to='/account'>
                <ProfileMenuCard>
                    <FontAwesomeIcon icon={faUser} />
                    <span>Account</span>
                </ProfileMenuCard>
            </Link>
            <ProfileMenuCard onClick={() => {
                setUser({})
                logoutUser()
                console.log('Logged out')
            }}>
                <FontAwesomeIcon icon={faRightFromBracket} />
                <span>Logout</span>
            </ProfileMenuCard>

            <div className={`w-full h-px my-4 ${theme === 'light' ? 'bg-black' : 'bg-white'}`}></div>

            <ProfileMenuCard>
                <FontAwesomeIcon icon={faGear} />
                <span>Settings</span>
            </ProfileMenuCard>
            <ProfileMenuCard>
                <FontAwesomeIcon icon={faCircleQuestion} />
                <span>Help</span>
            </ProfileMenuCard>
            <ProfileMenuCard>
                <FontAwesomeIcon icon={faMessage} />
                <span>Feedback</span>
            </ProfileMenuCard>
        </div>
    )

    // console.log(account)

    return (
        <div>

        </div>
    )
}

export default AccountPopUp