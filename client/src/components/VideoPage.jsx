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
import { useLoadingContext } from '../contexts/loadingContext';
import loading1 from '../assets/loading.gif'
import loading2 from '../assets/loading2.gif'
import PaginationCard from './PaginationCard';

function VideoPage() {
    const { theme } = useThemeContext()
    const { like, setLike, loginPopUp, setLoginPopUp } = usePopUpContext()
    const { user } = useUserContext()
    const { loading, setLoading } = useLoadingContext()

    const [videoNotFound, setVideoNotFound] = useState(false)

    const { videoId } = useParams()
    const videoURL = `${import.meta.env.VITE_BACKEND_URL}/video/?videoId=${videoId}`
    const [video, setVideo] = useState({})
    const likeURL = user?._id ? `${import.meta.env.VITE_BACKEND_URL}/like/?videoId=${videoId}&userId=${user?._id}` : `${import.meta.env.VITE_BACKEND_URL}/like/?videoId=${videoId}`
    const [likes, setLikes] = useState([])
    const [isLiked, setIsLiked] = useState(false)
    const [page, setPage] = useState(1)
    const commentURL = `${import.meta.env.VITE_BACKEND_URL}/comment/${videoId}?page=${page}`
    const [comments, setComments] = useState({})
    const suggestedVideosURL = `${import.meta.env.VITE_BACKEND_URL}/video/`
    const [suggestedVideos, setSuggestedVideos] = useState([])

    const [commentId, setCommentId] = useState('')
    const [videoId2, setVideoId2] = useState('')

    const [commentInput, setCommentInput] = useState('')
    const [commentButtons, setCommentButtons] = useState(false)
    const textAreaRef = useRef(null)
    const likeIconRef = useRef(null)

    const options = {
        method: 'POST',
        credentials: 'include'
    }

    const getVideo = async () => {
        fetch(videoURL, {
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res)
                if (res.data.length) {
                    return res.data[0]
                }
                else {
                    setVideoNotFound(true)
                }
            })
            .then((data) => {
                setVideo(data)
                console.log(data)
            })
            .catch((error) => console.log(error))
    }

    const getLikes = async () => {
        console.log(likeURL)
        console.log(user?._id)
        fetch(likeURL)
            .then((res) => {
                if (res.ok)
                    return res.json()
            })
            .then((res) => {
                setLikes(res.data)
                setIsLiked(res.data.isLiked)
                console.log(res.data)
            })
            .catch((err) => console.log(err))
    }

    const toggleLike = async () => {
        if (!user._id) {
            setLoginPopUp(true)
        }
        else {
            const url = `${import.meta.env.VITE_BACKEND_URL}/like?videoId=${videoId}`
            fetch(url, options)
                // .then((res) => res.json())
                .then((res) => {
                    console.log(res.status)
                    setIsLiked(res.status === 201 ? true : false)
                    if (res.status === 201) {
                        likeIconRef.current.style.width = '40px'
                        likeIconRef.current.style.height = '40px'
                        setTimeout(() => {
                            likeIconRef.current.style.width = ''
                            likeIconRef.current.style.height = ''
                        }, 200);
                    }
                })
                .catch((err) => console.log(err))
        }
    }

    const getComments = async () => {
        fetch(commentURL)
            .then((res) => res.json())
            .then((res) => {
                console.log(res.data)
                setComments(res.data)
            })
            .catch((err) => console.log(err))
    }

    const postComment = async () => {
        if (commentInput?.length) {
            console.log('check')
            if (user?.username) {
                const url = `${import.meta.env.VITE_BACKEND_URL}/comment/${videoId}`
                const data = {
                    content: commentInput
                }
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(data)
                }

                fetch(url, options)
                    .then((res) => res.json())
                    .then((res) => {
                        console.log(res)
                        if (res.statusCode === 201) {
                            setCommentInput('')
                            getComments()
                        }
                    })
                    .catch((err) => console.log(err))
            }
            else {
                setLoginPopUp(true)
            }
        }

    }

    const getSuggestedVideos = async () => {
        fetch(suggestedVideosURL)
            .then((res) => res.json())
            .then((res) => setSuggestedVideos(res.data.videos))
            .catch((err) => console.log(err))
    }

    const date = new Date(video?.createdAt);
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
            src: video?.videoFile,
            type: 'video/mp4'
        }]
    };

    useEffect(() => {
        window.scrollTo(0, 0)
        setVideoNotFound(false)
        getVideo()
        getLikes()
        getComments()
        getSuggestedVideos()
    }, [videoId])

    useEffect(() => {
        getLikes()
    }, [user, isLiked])

    useEffect(() => {
        getComments()
    }, [page])

    // useEffect(() => {
    //     if (!commentInput) {
    //         setCommentButtons(false)
    //     }
    // }, [commentInput])

    return (
        <div
            className='flex flex-row flex-wrap w-[95%] md:w-5/6 justify-between mb-10'
        // onClick={closeSidebar}
        >

            <div className='w-full md:w-[65%] flex flex-col gap-5'>
                {
                    videoNotFound && (
                        <div>

                        </div>
                    )
                }
                <div className='w-full'>
                    {
                        !videoNotFound ? !video?._id && (
                            <div className='w-full aspect-[16/9] bg-neutral-900 rounded-[10px] flex justify-center items-center'>
                                <img src={theme === 'light' ? loading1 : loading2} className='aspect-[1/1]' alt="" />
                            </div>
                        ) : (
                            <div className={`w-full text-3xl md:text-5xl aspect-[16/9] ${theme === 'light' ? 'bg-neutral-400' : 'bg-neutral-900'} rounded-[10px] flex justify-center items-center`}>
                                Video Not Found
                            </div>
                        )
                    }

                    {
                        video?._id && (
                            <VideoPlayer options={videoJsOptions} />
                        )
                    }

                    {/* <VideoPlayer options={videoJsOptions} /> */}
                </div>

                {
                    !videoNotFound ? video?._id ? (
                        <div className='flex flex-col gap-5'>
                            <div className='flex justify-between'>
                                <div className='flex flex-col gap-2'>
                                    <div className='text-3xl'>
                                        {video.title}
                                    </div>

                                    <div className='flex flex-wrap gap-2 items-center'>
                                            <span>{video.views} views</span>
                                            <span className='pb-0.5'>|</span>
                                            <span>{formattedDate}</span>

                                    </div>
                                </div>

                                <div className='flex flex-col justify-evenly items-center'>
                                    <div className='flex w-full items-center relative'>
                                        <FontAwesomeIcon ref={likeIconRef} className='cursor-pointer absolute left-4 transform -translate-x-1/2 aspect-[1/1]' icon={isLiked ? heart1 : heart2} style={{ color: "#822eff", transition: "height 150ms ease-out, width 150ms ease-out" }} size='2x' onClick={toggleLike} />
                                        <div className='flex w-full justify-end items-center'>{likes?.totalLikes}</div>
                                    </div>
                                    <div className='text-xs cursor-pointer transition-colors duration-150 hover:text-purple-500' onClick={() => {
                                        setVideoId2(videoId)
                                        setLike(true)
                                    }}>
                                        View Likes
                                    </div>
                                </div>
                            </div>

                            <div className=''>
                                <Link to={`/channel/${video?.owner?.username}`} className='flex items-center gap-4 w-fit'>
                                    <img className='w-12 border-2 border-purple-600 rounded-full object-cover' src={video?.owner?.avatar} style={{ aspectRatio: 1 / 1 }} alt="" />
                                    <span className='text-2xl pb-2'>{video?.owner?.username}</span>
                                </Link>
                            </div>

                            <div className={`flex flex-col gap-2 rounded-xl py-2 px-4 ${theme === 'light' ? 'bg-neutral-200' : 'bg-neutral-900'}`}>
                                <div className='text-xl'>Description</div>
                                <div className=''>{video?.description}</div>
                            </div>
                        </div>

                    ) : (

                        <div className='flex flex-col gap-5'>
                            <div className='flex justify-between'>
                                <div className='flex flex-col gap-2'>
                                    <div className='w-40 h-3 bg-gray-300 text-gray-300 rounded-2xl'>

                                    </div>
                                    <div className='w-40 h-3 bg-gray-300 text-gray-300 rounded-2xl'>

                                    </div>

                                    <div className='flex justify-between'>
                                        <div className='w-20 h-2 bg-gray-300 text-gray-300 rounded-2xl'>

                                        </div>

                                    </div>
                                </div>

                                <div className='flex flex-col justify-evenly items-center'>
                                    <div className='flex justify-center items-center gap-3'>
                                        <FontAwesomeIcon className='cursor-pointer' icon={heart2} style={{ color: "#822eff", }} size='2x' onClick={toggleLike} />
                                        <div className='w-2'></div>
                                    </div>
                                </div>
                            </div>

                            <div className=''>
                                <Link to={`/channel/${video?.owner?.username}`} className='flex items-center gap-4 w-fit'>
                                    <img className='w-12 border-2 border-purple-600 rounded-full object-cover' src='https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg' style={{ aspectRatio: 1 / 1 }} alt="" />
                                    <span className='text-2xl pb-2 w-40 h-3 bg-gray-300 text-gray-300 rounded-2xl'></span>
                                </Link>
                            </div>

                            <div className={`flex flex-col gap-2 rounded-xl py-2 px-4 ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-900'}`}>
                                <div className='text-xl'>Description</div>
                                <div className='w-40 h-3 bg-gray-300 text-gray-300 rounded-2xl'></div>
                            </div>
                        </div>
                    ) : (<div />)
                }

                {
                    !videoNotFound && (
                        <div className={`flex flex-col rounded-xl pt-4 pb-10 px-4 ${theme === 'light' ? 'bg-neutral-200' : 'bg-neutral-900'} gap-6`}>
                            <div className='text-xl'>{comments?.totalComments} Comments</div>

                            <div className='w-full flex'>
                                <div className='flex w-full gap-2'>
                                    <div className='w-12 aspect-square'>
                                        <img src={user?.avatar || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'} className='w-12 aspect-square rounded-full border-2 border-purple-600 object-cover' alt="" />
                                    </div>
                                    <div className='flex-1 pt-3 flex-col justify-center'>
                                        <textarea
                                            type="text"
                                            placeholder='Add a Comment'
                                            className={`flex flex-row w-full justify-center resize-none h-auto items-end px-2 outline-none ${theme === 'light' ? 'bg-neutral-200' : 'bg-neutral-900'}`}
                                            value={commentInput}
                                            ref={textAreaRef}
                                            rows={1}
                                            onInput={() => {
                                                const textArea = textAreaRef.current
                                                if (textArea) {
                                                    textArea.style.height = 'auto'
                                                    textArea.style.height = `${textArea.scrollHeight}px`
                                                }
                                            }}
                                            onChange={(e) => {
                                                const input = e.target.value
                                                if (!input) {
                                                    setCommentButtons(false)
                                                }
                                                else {
                                                    setCommentButtons(true)
                                                }
                                                setCommentInput(input)}
                                            }
                                            onFocus={() => setCommentButtons(true)}
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
                                        {
                                            commentButtons ? (
                                                <div className='w-full flex justify-end mt-2 gap-3'>
                                                    <button className={`px-3 py-1 rounded-lg ${theme === 'light' ? 'bg-neutral-200' : 'bg-neutral-800'}`} onClick={() => {
                                                        setCommentInput('')
                                                        setCommentButtons(false)
                                                        const textArea = textAreaRef.current
                                                        if (textArea) {
                                                            textArea.style.height = 'auto'
                                                        }
                                                    }}>Cancel</button>

                                                    <button
                                                        className={`px-3 py-1 rounded-lg bg-purple-600`}
                                                        onClick={postComment}
                                                    >
                                                        Comment
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className='w-full h-10'>

                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>

                            {
                                !comments?.comments && (
                                    <div className='w-full h-20 flex justify-center items-center'>
                                        <img src={theme === 'light' ? loading1 : loading2} className='aspect-[1/1]' alt="" />
                                    </div>
                                )
                            }

                            {comments?.comments && comments?.comments?.map((comment) => (
                                <CommentCard comment={comment} setLike={setLike} setCommentId={setCommentId} key={comment._id} />
                            ))}

                            {
                                comments?.comments && (
                                    <PaginationCard page={page} setPage={setPage} lastPage={comments?.totalPages || 1} />
                                )
                            }
                            
                        </div>
                    )
                }
            </div>

            <div className='flex flex-col items-center w-full md:w-[32%] gap-3 pt-3'>
                <div className='w-full'>Suggested videos</div>
                {
                    !suggestedVideos.length && (
                        <div className='w-full h-40 flex justify-center items-center'>
                            <img src={theme === 'light' ? loading1 : loading2} className='aspect-[1/1]' alt="" />
                        </div>
                    )
                }

                {
                    suggestedVideos.length && suggestedVideos.map((video) => {
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