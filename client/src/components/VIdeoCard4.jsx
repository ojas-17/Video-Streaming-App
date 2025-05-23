import React from 'react'
import { Link } from 'react-router-dom';

function VideoCard4({video}) {
    const date = new Date(video.createdAt);
    const formattedDate = date.toLocaleString("en-UK", {
        // weekday: 'long', // e.g. "Monday"
        year: 'numeric', // e.g. "2024"
        month: 'short',   // e.g. "November"
        day: 'numeric',  // e.g. "11"
        // hour: '2-digit', // e.g. "12"
        // minute: '2-digit', // e.g. "34"
        // second: '2-digit' // e.g. "56"
      });

  return (
    <div className='w-full sm:w-1/3 lg:w-1/3 xl:w-1/4 flex flex-col gap-2 p-3 text-lg'>
        <Link className='w-full relative' to={`/watch/${video._id}`}>
            <div className='z-10 relative'>
                <img className='w-full rounded-xl object-cover transition-transform duration-200 hover:translate-x-1.5 hover:-translate-y-1.5 ' src={video.thumbnail} alt="" />
            </div>
            <div className='absolute z-0 top-0 left-0 w-full rounded-xl bg-purple-800' style={{aspectRatio: 16/9}}></div>
        </Link>

        <div className='w-full flex flex-col gap-1 px-2'>
            <div className='w-full text-2xl overflow-hidden whitespace-nowrap text-ellipsis'>
                <Link className='w-full transition-colors duration-150' to={`/watch/${video._id}`}>
                    {video.title}
                </Link>
            </div>
            <div >
                <Link className='flex gap-1 lg:gap-3' to={`/watch/${video._id}`}>
                    <div>{video.views} views</div>
                    |
                    <div>{formattedDate}</div>
                </Link>
            </div>
            <div >
                <Link className='flex items-center gap-2 lg:gap-3' to={`/channel/${video?.owner?.username}`} >
                    <div>
                        <img className='w-6 lg:w-8 rounded-full object-cover border-2 border-purple-800' style={{aspectRatio: 1/1}} src={video.owner.avatar} alt="" />
                    </div>
                    <div className=' transition-colors duration-150 hover:text-purple-600'>
                        {video.owner.username}
                    </div>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default VideoCard4