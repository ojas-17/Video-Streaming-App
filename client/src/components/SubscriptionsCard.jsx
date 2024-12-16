import React, { useRef, useState } from 'react'
import { useUserContext } from '../contexts/userContext'
import { Link } from 'react-router-dom'

function SubscriptionsCard({ channel }) {
    const {user} = useUserContext()

    const [isSubscribed, setIsSubscribed] = useState(true)
    const subscribeButtonRef = useRef(null)
    
    const handleSubscribe = async () => {
        if (!user?._id) {
            setLoginPopUp(true)
        }

        else {
            const url = `${import.meta.env.VITE_BACKEND_URL}/subscription/${channel?._id}`
            const options = {
                method: 'POST',
                credentials: 'include'
            }

            fetch(url, options)
                .then(res => res.json())
                .then(res => {
                    // console.log(res)
                    if (res.statusCode === 200) {
                        setIsSubscribed(false)
                    }
                    else if (res.statusCode === 201) {
                        // console.log('check1')
                        setIsSubscribed(true)
                        subscribeButtonRef.current.style.transform = 'scale(1.1)'
                        setTimeout(() => {
                            // console.log('check2')
                            subscribeButtonRef.current.style.transform = 'scale(1)'
                        }, 200);
                    }
                    else if (res.statusCode >= 400) {
                        setErrorMsg(res.message)
                        setTimeout(() => {
                            setErrorMsg('')
                        }, 2000);
                    }
                })
                .catch(err => console.log(err))
        }
    }

    return (
        <div className='w-full flex justify-between'>
            <Link to={`/channel/${channel?.username}`} className='flex gap-5 lg:gap-10'>
                <div className='w-16 sm:w-28 lg:w-40'>
                    <img className='w-full aspect-square object-cover rounded-full border-2 lg:border-4 border-purple-600' src={channel?.avatar} alt="" />
                </div>

                <div className='flex items-center text-xl sm:text-2xl lg:text-4xl'>
                    {channel?.username}
                </div>
            </Link>

            <div className='flex items-center'>
                <button
                    ref={subscribeButtonRef}
                    onClick={handleSubscribe}
                    className={`text-md sm:text-2xl w-28 sm:w-40 border-2 border-purple-600 ${isSubscribed ? 'bg-purple-600' : 'lg:hover:bg-purple-600'} transition-all duration-200 ease-out pb-1.5 sm:pb-2 pt-1 px-1 sm:px-3`}
                >
                    {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                </button>
            </div>

        </div>
    )
}

export default SubscriptionsCard