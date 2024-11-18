import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import VideoCard3 from './VideoCard3'
import { useThemeContext } from '../contexts/themeContext'

function ChannelPage() {
    const { username } = useParams()

    const { theme } = useThemeContext()

    const [user, setUser] = useState({})
    const [videos, setVideos] = useState([])

    const [sortBy, setSortBy] = useState('createdAt')

    const getChannelProfile = async (url) => {
        fetch(url)
            .then((res) => res.json())
            .then(res => setUser(res.data))
            .catch((err) => console.log(err))
    }

    const getVideos = async (url) => {
        fetch(url)
            .then((res) => res.json())
            .then(res => setVideos(res.data.videos))
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        const url1 = `${import.meta.env.VITE_BACKEND_URL}/users/c/${username}`
        getChannelProfile(url1)
    }, [username])

    useEffect(() => {
        const url2 = `${import.meta.env.VITE_BACKEND_URL}/video/?userId=${user._id}&sortBy=${sortBy}`
        getVideos(url2)
    }, [user, sortBy])

    return (
        <div className=' lg:w-5/6 flex flex-col gap-5'>
            <div className='relative w-full h-60 lg:h-96 bg-slate-400 rounded-xl'>
                <img className='h-full w-full object-cover rounded-xl' src={user.coverImage} alt="" />
                <div className='absolute h-1/2 w-full flex bottom-0 opacity-50 bg-black rounded-b-xl'></div>
                <div className='absolute h-1/2 w-full flex gap-5 sm:gap-10 bottom-0'>
                    {/* <div className='flex aspect-[1/1] gap-10 h-full max-w-1/3 bottom-0 '> */}
                    <img className='object-cover rounded-full aspect-[1/1] max-w-1/3' src={user.avatar} alt="" />
                    <div className='flex flex-col text-white justify-center w-full'>
                        <span className='text-2xl sm:text-4xl'>{user.username}</span>
                        {/* <div className='flex flex-wrap gap-2 items-center'> */}
                        <span className='text-sm sm:text-xl flex flex-wrap'>{user.subscribersCount} Subscribers</span>
                        <span className='text-sm sm:text-xl flex flex-wrap'>Subscribed To {user.channelsSubscribedToCount} Channels</span>
                        {/* </div> */}
                    </div>
                    {/* </div> */}
                </div>
            </div>

            <div className='px-5 flex flex-col gap-5'>
                <div className='flex gap-5'>
                <button className={`text-xl px-2 py-3 w-28 rounded-lg ${sortBy === 'createdAt' ? 'text-purple-600' : ''} ${sortBy === 'createdAt' ? theme === 'light' ? 'bg-neutral-400' : 'bg-neutral-900' : theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-700'}`} onClick={() => setSortBy('createdAt')}>Latest</button>
                <button className={`text-xl px-2 py-3 w-28 rounded-lg ${sortBy === 'views' ? 'text-purple-600' : ''} ${sortBy === 'views' ? theme === 'light' ? 'bg-neutral-400' : 'bg-neutral-900' : theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-700'}`} onClick={() => setSortBy('views')}>Popular</button>
                </div>
                <div className='flex flex-wrap'>
                    {
                        videos.map((video) => {
                            return (
                                <VideoCard3 video={video} key={video._id} />
                            )
                        })
                    }
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}

export default ChannelPage