import React, { useEffect, useState } from 'react'
import VideoPlayer from "./VideoPlayer"
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as heart1 } from '@fortawesome/free-solid-svg-icons';
import { faHeart as heart2 } from '@fortawesome/free-regular-svg-icons';
import CommentCard from './CommentCard';
import VideoCard1 from './VideoCard1';
import VideoCard2 from './VideoCard2';
import { useThemeContext } from '../contexts/themeContext';
import { usePopUpContext } from '../contexts/popUpContext';
import LikePopUp from './LikePopUp';
import { useRef } from 'react';
import { useUserContext } from '../contexts/userContext';


function VideoPage() {
    const { theme } = useThemeContext()
    const { like, setLike, loginPopUp, setLoginPopUp } = usePopUpContext()
    const { user } = useUserContext()

    const { videoId } = useParams()
    const videoURL = `${import.meta.env.VITE_BACKEND_URL}/video/?videoId=${videoId}`
    const [video, setVideo] = useState({})
    const likeURL = user._id ? `${import.meta.env.VITE_BACKEND_URL}/like/?videoId=${videoId}&userId=${user._id}` : `${import.meta.env.VITE_BACKEND_URL}/like/?videoId=${videoId}`
    const [likes, setLikes] = useState([])
    const commentURL = `${import.meta.env.VITE_BACKEND_URL}/comment/${videoId}`
    const [comments, setComments] = useState({})
    const suggestedVideosURL = `${import.meta.env.VITE_BACKEND_URL}/video/`
    const [suggestedVideos, setSuggestedVideos] = useState([])

    const [commentId, setCommentId] = useState('')
    const [videoId2, setVideoId2] = useState('')

    const [commentInput, setCommentInput] = useState('')
    const textAreaRef = useRef(null)

    const getVideo = async () => {
        fetch(videoURL)
            .then((res) => res.json())
            .then((res) => res.data.videos[0])
            .then((data) => {
                setVideo(data)
                // console.log(data)
            })
            .catch((error) => console.log(error))
    }

    const getLikes = async () => {
        fetch(likeURL)
            .then((res) => res.json())
            .then((res) => {
                setLikes(res.data)
                console.log(res.data)
            })
            .catch((err) => console.log(err))
    }

    const toggleLike = async () => {
        if(!user._id) {
            setLoginPopUp(true)
        }
        else {
            const url = `${import.meta.env.VITE_BACKEND_URL}/like?videoId=${videoId}`
            fetch(url, {
                method: 'POST'
            })
            .then((res) => res.json())
            .then((res) => console.log(res))
            .catch((err) => console.log(err))
        }
    }

    const getComments = async () => {
        fetch(commentURL)
            .then((res) => res.json())
            .then((res) => setComments(res.data))
            .catch((err) => console.log(err))
    }

    const getSuggestedVideos = async () => {
        fetch(suggestedVideosURL)
            .then((res) => res.json())
            .then((res) => setSuggestedVideos(res.data.videos))
            .catch((err) => console.log(err))
    }

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

    const videoJsOptions = {
        autoplay: true,
        controls: true,
        // responsive: true,
        // fluid: true,
        sources: [{
            src: video.videoFile,
            type: 'video/mp4'
        }]
    };

    useEffect(() => {
        getVideo()
        getLikes()
        getComments()
        getSuggestedVideos()
    }, [videoId])

    return (
        <div
            className='flex flex-row flex-wrap w-5/6 justify-between mb-10'
        // onClick={closeSidebar}
        >
            <div className='w-full md:w-[65%] flex flex-col gap-5'>
                <div className='w-full'>
                    <VideoPlayer options={videoJsOptions} />
                    {/* <VideoPlayer options={videoJsOptions} /> */}
                </div>

                <div className='flex flex-col gap-5'>
                    <div className='flex justify-between'>
                        <div className='flex flex-col gap-2'>
                            <div className='text-3xl'>
                                {video.title}
                            </div>

                            <div className='flex justify-between'>
                                <div>
                                    <span>{video.views} views</span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                                    <span>{formattedDate}</span>
                                </div>

                            </div>
                        </div>

                        <div className='flex flex-col justify-evenly items-center'>
                            <div className='flex justify-center items-center gap-3'>
                                <FontAwesomeIcon className='cursor-pointer' icon={likes?.isLiked ? heart1 : heart2} style={{ color: "#822eff", }} size='2x' onClick={toggleLike}/>
                                <div>{likes?.totalLikes}</div>
                            </div>
                            <div className='text-xs cursor-pointer transition-colors duration-150 hover:text-purple-500' onClick={() => {
                                setVideoId2(videoId)
                                setLike(true)
                            }}>
                                View Likes
                            </div>
                        </div>
                    </div>

                    {/*

                    */}

                    <div className=''>
                        <Link to={`/channel/${video?.owner?.username}`} className='flex items-center gap-4 w-fit'>
                            <img className='w-12 border-2 border-purple-600 rounded-full object-cover' src={video?.owner?.avatar} style={{ aspectRatio: 1 / 1 }} alt="" />
                            <span className='text-2xl pb-2'>{video?.owner?.username}</span>
                        </Link>
                    </div>

                    <div className={`flex flex-col gap-2 rounded-xl py-2 px-4 ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-900'}`}>
                        <div className='text-xl'>Description</div>
                        <div className=''>{video?.description}</div>
                    </div>
                </div>

                <div className={`flex flex-col rounded-xl py-2 px-4 ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-900'} gap-6`}>
                    <div className='text-xl'>{comments?.totalComments} Comments</div>

                    <div className='w-full flex'>
                        <div className='flex w-full gap-2'>
                            <div className='w-12'>
                                <img src={user?.avatar || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'} className='w-12 rounded-full border-2 border-purple-600 object-cover' style={{ aspectRatio: 1 / 1 }} alt="" />
                            </div>
                            <div className='flex pt-3 flex-col justify-center w-full'>
                                <textarea
                                type="text"
                                placeholder='Add a Comment'
                                className={`flex flex-row justify-center resize-none h-auto items-end px-2 outline-none ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-900'}`}
                                value={commentInput}
                                ref={textAreaRef}
                                rows={1}
                                onInput={() => {
                                    const textArea = textAreaRef.current
                                    if(textArea) {
                                        textArea.style.height = 'auto'
                                        textArea.style.height = `${textArea.scrollHeight}px`
                                    }
                                }}
                                onChange={(e) => setCommentInput(e.target.value)}
                                />
                                {/* <div
                                className='w-full flex items-end flex-wrap border-none outline-none'
                                style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}
                                contentEditable={true}
                                onInput={(e) => setCommentInput(e.target.innerText)}
                                >
                                    {commentInput}
                                </div> */}
                                <div className={`w-full mx-1 h-px ${theme === 'light' ? 'bg-black' : 'bg-white'}`}></div>
                                <div className='w-full flex justify-end mt-2 gap-3'>
                                    <button className={`px-3 py-1 rounded-lg ${theme === 'light' ? 'bg-neutral-200' : 'bg-neutral-800'}`} onClick={() => {
                                        setCommentInput('')
                                        const textArea = textAreaRef.current
                                        if(textArea) {
                                            textArea.style.height = 'auto'
                                        }
                                    }}>Cancel</button>

                                    <button
                                    className={`px-3 py-1 rounded-lg bg-purple-600`}
                                    onClick={() => {
                                        if(commentInput?.length) {
                                            if(user?.username) {

                                            }
                                            else {
                                                setLoginPopUp(true)
                                            }
                                        }
                                    }}
                                    >
                                        Comment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {comments?.comments?.map((comment) => (
                        <CommentCard comment={comment} setLike={setLike} setCommentId={setCommentId} key={comment._id} />
                    ))}
                </div>
            </div>

            <div className='flex flex-col items-center w-full md:w-[32%] gap-3 pt-3'>
                <div className='w-full'>Suggested videos</div>
                {
                    suggestedVideos.map((video) => {
                        return (
                            <VideoCard2 video={video} key={video._id} />
                        )
                    })
                }
            </div>

            <div>
                <LikePopUp videoId2={videoId2} setVideoId2={setVideoId2} commentId={commentId} setCommentId={setCommentId} />
            </div>

            {
                // like && (
                //     <div className='fixed w-full h-full left-0 top-0 z-20 bg-slate-600' onClick={() => setLike(false)}>

                //     </div>
                // )
            }

        </div>
    )
}

export default VideoPage