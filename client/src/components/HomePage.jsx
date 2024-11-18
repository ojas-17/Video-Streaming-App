import React, { useEffect, useState } from 'react'
import VideoCard4 from './VIdeoCard4'

function HomePage() {
    const [videos, setVideos] = useState([])

    const getVideos = async (url) => {
        fetch(url)
            .then((res) => res.json())
            .then(res => setVideos(res.data.videos))
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/video/`
        getVideos(url)
    }, [])

    return (
        <div className=' lg:w-5/6 flex flex-col gap-5'>
            <div className='p-5 flex flex-col gap-5'>
                <span className='text-2xl p-3'>Latest Videos</span>
                <div className='flex flex-wrap'>
                    {
                        videos.map((video) => {
                            return (
                                <VideoCard4 video={video} key={video._id} />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default HomePage