import React, { useEffect, useState } from 'react'
import VideoCard4 from './VIdeoCard4'
import { useLoadingContext } from '../contexts/loadingContext';

import { useThemeContext } from '../contexts/themeContext'

function HomePage() {
    const [videos, setVideos] = useState([])
    const { loading, setLoading } = useLoadingContext()
    const { theme } = useThemeContext()

    const getVideos = async (url) => {
        setLoading(true)
        // setTimeout(() => {
        //     fetch(url)
        //         .then((res) => res.json())
        //         .then(res => setVideos(res.data.videos))
        //         .catch((err) => console.log(err))
        //         .finally(() => setLoading(false))
        // }, 10000);

        fetch(url)
        .then((res) => res.json())
        .then(res => setVideos(res.data.videos))
        .catch((err) => console.log(err))
        .finally(() => setLoading(false))
    }

    useEffect(() => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/video/?limit=12`
        getVideos(url)
    }, [])


    return (
        <div className=' lg:w-5/6 flex flex-col gap-5 mb-8'>
            <div className='p-5 flex flex-col gap-5'>
                <span className='text-2xl p-3'>Latest Videos</span>
                {
                    !loading && (
                        <div className='flex flex-wrap'>
                            {
                                videos.map((video) => {
                                    return (
                                        <VideoCard4 video={video} key={video._id} />
                                    )
                                })
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default HomePage