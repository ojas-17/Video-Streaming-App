import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useUserContext } from '../contexts/userContext';
import { useThemeContext } from '../contexts/themeContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { TbDotsVertical } from "react-icons/tb";
import { MdModeEditOutline } from "react-icons/md";



function VideoCard3({ video, userChannel, openUpdatePopUp, openDeletePopUp }) {
    const { user } = useUserContext()
    const { theme } = useThemeContext()

    const [isHovered, setIsHovered] = useState(false)
    const [videoOptions, setVideoOptions] = useState(false)

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

    useEffect(() => {
        if(window.innerWidth < 1024) {
            setIsHovered(true)
        }
    }, [isHovered])

    return (
        <div
        onMouseLeave={() => {
            if(window.innerWidth >= 640) {
                setVideoOptions(false)
            }
        }}
        className='w-full sm:w-1/3 lg:w-1/3 xl:w-1/4 flex flex-col gap-2 p-3 text-lg'
        >
            {
                videoOptions && (
                    <div onClick={() => setVideoOptions(false)} className='fixed z-10 top-0 left-0 w-full h-screen'>

                    </div>
                )
            }

            <Link className='w-full relative' to={`/watch/${video._id}`}>
                <div className='z-10 relative'>
                    <img className='w-full rounded-xl object-cover transition-transform duration-200 hover:translate-x-1.5 hover:-translate-y-1.5 ' src={video.thumbnail} alt="" />
                </div>
                <div className='absolute z-0 top-0 left-0 w-full rounded-xl bg-purple-700' style={{ aspectRatio: 16 / 9 }}></div>
            </Link>

            <div
                className='flex flex-col gap-1 px-2'
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className='relative text-2xl flex justify-between'>
                    <Link className='transition-colors duration-150 overflow-hidden whitespace-nowrap text-ellipsis' to={`/watch/${video._id}`}>
                        {video.title}
                    </Link>
                    {
                        user?._id && userChannel?._id && (user?._id === userChannel?._id) && isHovered && (
                            <div
                                className={`${isHovered ? 'cursor-pointer' : ''} flex justify-center items-center rounded-full aspect-[1/1] h-full transition-colors duration-100   ${isHovered ? theme === 'light' ? 'hover:bg-neutral-400' : 'hover:bg-neutral-900' : ''}`}
                                onClick={() => setVideoOptions(true)}
                            >
                                {/* <FontAwesomeIcon icon={faEllipsisVertical} /> */}
                                <TbDotsVertical />
                                {
                                    // isHovered && (
                                    //     <TbDotsVertical />
                                    // )
                                }
                            </div>
                        )
                    }

                    {
                        videoOptions && (
                            <div className={`absolute z-10 flex flex-col gap-1 text-xl p-3 rounded-lg right-0 -translate-y-24 ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-900'}`}>
                                <div
                                className={`flex items-center gap-1 px-3 py-1 rounded-lg cursor-pointer ${theme === 'light' ? 'hover:bg-neutral-400' : 'hover:bg-neutral-700'}`}
                                onClick={() => openUpdatePopUp(video?._id, video?.title, video?.description, video?.thumbnail)}
                                >
                                    <MdModeEditOutline />
                                    <span>Update</span>
                                </div>
                                <div
                                className={`flex items-center gap-2 px-3 py-1 rounded-lg cursor-pointer ${theme === 'light' ? 'hover:bg-neutral-400' : 'hover:bg-neutral-700'}`}
                                onClick={() => openDeletePopUp(video?._id, video?.title, video?.thumbnail)}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                    <span>Delete</span>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div >
                    <Link className='flex flex-wrap gap-1 lg:gap-3' to={`/watch/${video._id}`}>
                        <div>{video.views} views</div>
                        |
                        <div>{formattedDate}</div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default VideoCard3