import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import VideoCard3 from './VideoCard3'
import { useThemeContext } from '../contexts/themeContext'
import { useLoadingContext } from '../contexts/loadingContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { IoVideocam } from "react-icons/io5";
import { useUserContext } from '../contexts/userContext'
import { useRef } from 'react'
import { IoMdClose } from "react-icons/io";
import { usePopUpContext } from '../contexts/popUpContext'
import PaginationCard from './PaginationCard'

function ChannelPage() {
    const { username } = useParams()

    const { theme } = useThemeContext()
    const { user } = useUserContext()
    const { loading, setLoading, setMsg, setErrorMsg } = useLoadingContext()
    const { loginPopUp, setLoginPopUp } = usePopUpContext()

    const [userChannel, setUserChannel] = useState({})
    const [videos, setVideos] = useState([])

    const [image1, setImage1] = useState(null);
    const [imagePreview1, setImagePreview1] = useState(null)
    const [image2, setImage2] = useState(null);
    const [imagePreview2, setImagePreview2] = useState(null)

    const [updatePopUp, setUpdatePopUp] = useState(false)
    const [deletePopUp, setDeletePopUp] = useState(false)

    const [videoId, setVideoId] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDesciption] = useState('')
    const textAreaRef = useRef(null)
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // Set the image preview
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    }

    const openUpdatePopUp = (_id, title, description, thumbnail) => {
        setUpdatePopUp(true)
        setVideoId(_id)
        setTitle(title)
        setDesciption(description)
        setImagePreview(thumbnail)
    }

    const closeUpdatePopUp = () => {
        setUpdatePopUp(false)
        setVideoId('')
        setTitle('')
        setDesciption('')
        setImage(null)
        setImagePreview(null)
    }

    const openDeletePopUp = (videoId, title, thumbnail) => {
        setDeletePopUp(true)
        setVideoId(videoId)
        setTitle(title)
        setImagePreview(thumbnail)
    }

    const closeDeletePopUp = () => {
        setDeletePopUp(false)
        setVideoId('')
        setTitle('')
        setImagePreview(null)
    }

    const handleUpdateVideo = async () => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/video/${videoId}`
        const formData = new FormData()
        formData.append('thumbnail', image)
        formData.append('title', title)
        formData.append('description', description)
        const options = {
            method: 'PATCH',
            credentials: 'include',
            body: formData
        }

        fetch(url, options)
            .then((res) => res.json())
            .then((res) => {
                if (res.statusCode === 200) {
                    setMsg(res.message)
                    getVideos()
                    setTimeout(() => {
                        setMsg('')
                    }, 2000);
                }
                else {
                    setErrorMsg(res.message)
                    setTimeout(() => {
                        setErrorMsg('')
                    }, 2000);
                }
            })
            .catch((err) => console.log(err))
    }

    const handleDeleteVideo = async () => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/video/${videoId}`
        const options = {
            method: 'DELETE',
            credentials: 'include',
        }

        fetch(url, options)
            .then((res) => res.json())
            .then((res) => {
                if (res.statusCode === 200) {
                    setMsg(res.message)
                    getVideos()
                    setDeletePopUp(false)
                    setTimeout(() => {
                        setMsg('')
                    }, 2000);
                }
                else {
                    setErrorMsg(res.message)
                    setTimeout(() => {
                        setErrorMsg('')
                    }, 2000);
                }
            })
            .catch((err) => console.log(err))
    }

    const handleImageChange1 = (event) => {
        const file = event.target.files[0];

        if (file) {
            setImage1(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview1(reader.result); // Set the image preview
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };

    const handleImageChange2 = (event) => {
        const file = event.target.files[0];

        if (file) {
            setImage2(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview2(reader.result); // Set the image preview
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };

    const handleUpdate = async () => {
        if (image1) {
            const url = `${import.meta.env.VITE_BACKEND_URL}/users/cover-image`
            const formData = new FormData()
            formData.append('coverImage', image1)

            const options = {
                method: 'PATCH',
                body: formData,
                credentials: 'include'
            }

            fetch(url, options)
                .then((res) => res.json())
                .then((res) => {
                    setImage1(null)
                    getChannelProfile()
                    setImagePreview1(null)
                })
                .catch((err) => console.log(err))
        }

        if (image2) {
            const url = `${import.meta.env.VITE_BACKEND_URL}/users/avatar`
            const formData = new FormData()
            formData.append('avatar', image2)

            const options = {
                method: 'PATCH',
                body: formData,
                credentials: 'include'
            }

            fetch(url, options)
                .then((res) => res.json())
                .then((res) => {
                    setImage2(null)
                    getChannelProfile()
                    setImagePreview2(null)
                })
                .catch((err) => console.log(err))
        }
    }


    const [sortBy, setSortBy] = useState('createdAt')

    const getChannelProfile = async () => {
        // setLoading(true)
        const url = user?._id ? `${import.meta.env.VITE_BACKEND_URL}/users/c/${username}?userId=${user?._id}` : `${import.meta.env.VITE_BACKEND_URL}/users/c/${username}`
        fetch(url)
            .then((res) => res.json())
            .then(res => setUserChannel(res.data))
            .catch((err) => console.log(err))
            .finally(() => setLoading(false))
    }

    const [page, setPage] = useState(1)
    const limit = 12

    const getVideos = async () => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/video/?userId=${userChannel._id}&sortBy=${sortBy}&page=${page}&limit=${limit}`
        fetch(url)
            .then((res) => res.json())
            .then(res => {
                if (res.statusCode < 400) {
                    console.log("Success", res)
                    setVideos(res.data)
                }
                else {
                    console.log("Error", res)
                }
            })
            .catch((err) => console.log(err))
    }

    const subscribeButtonRef = useRef(null)
    const handleSubscribe = async () => {
        if (!user?._id) {
            setLoginPopUp(true)
        }

        else {
            const url = `${import.meta.env.VITE_BACKEND_URL}/subscription/${userChannel?._id}`
            const options = {
                method: 'POST',
                credentials: 'include'
            }

            fetch(url, options)
                .then(res => res.json())
                .then(res => {
                    // console.log(res)
                    getChannelProfile()
                    if (res.statusCode === 201) {
                        // console.log('check1')
                        subscribeButtonRef.current.style.transform = 'scale(1.1)'
                        setTimeout(() => {
                            // console.log('check2')
                            subscribeButtonRef.current.style.transform = 'scale(1)'
                        }, 300);
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

    useEffect(() => {
        setLoading(true)
        getChannelProfile()
    }, [username, user])

    useEffect(() => {
        if (userChannel?._id) {
            getVideos()
        }
    }, [userChannel, sortBy, page])

    if (loading) return (
        <div></div>
    )

    return (
        <div className='w-full lg:w-5/6 flex flex-col gap-5 mb-8'>
            {
                updatePopUp && (
                    <div className='fixed z-20 top-0 left-0 w-full h-screen flex justify-center items-center bg-opacity-30 bg-black '>
                        <div className={`w-11/12 md:w-3/4 max-h-[90%] relative flex flex-col gap-10 rounded-2xl px-4 md:px-10 py-14 ${theme === 'light' ? 'bg-neutral-200' : 'bg-neutral-800'}`}>

                            <div className={`absolute top-0 right-0 m-2 rounded-full p-0.5 ${theme === 'light' ? 'hover:bg-neutral-400' : 'hover:bg-neutral-700'}`}>
                                <IoMdClose className='text-3xl cursor-pointer' onClick={closeUpdatePopUp} />
                            </div>

                            <div className='flex flex-col gap-10 overflow-y-auto'>
                                <div className='w-full flex justify-center items-center text-3xl'>
                                    Update Video Details
                                </div>

                                <div className='flex flex-wrap justify-between gap-5 lg:gap-0'>
                                    <div className='w-full lg:w-[48%] 2xl:w-[45%] flex flex-col gap-3'>
                                        <div className={`w-full aspect-[16/9] relative rounded-xl ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-900'} hover:shadow-lg hover:shadow-purple-500 transition-shadow duration-200`}>
                                            <label htmlFor="thumbnail-file" className={`w-full h-full absolute rounded-xl flex justify-center items-center gap-1 cursor-pointer transition-all duration-100 bg-black bg-opacity-0 hover:bg-opacity-50 opacity-0 hover:opacity-100 ${!imagePreview ? 'opacity-100' : ''}`}>
                                                <FontAwesomeIcon icon={faPenToSquare} />
                                                <span>Choose File</span>
                                            </label>
                                            <input id='thumbnail-file' type="file" accept='image/*' className='hidden' onChange={handleImageChange} />
                                            {
                                                imagePreview && (
                                                    <img className='h-full w-full object-cover rounded-xl' src={imagePreview} alt="" />
                                                )
                                            }
                                        </div>
                                        <div className='text-center text-xl'>
                                            Thumbnail File
                                        </div>

                                    </div>

                                    <div className='w-full lg:w-[48%] 2xl:w-[45%] flex flex-col gap-5'>
                                        <div className='w-full flex flex-col gap-1'>
                                            <label className='ml-3' htmlFor="">Title</label>
                                            <input
                                                type="text"
                                                placeholder='Enter Title'
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className={`w-full p-3 rounded-lg outline-none placeholder-neutral-500 focus:shadow-md focus:shadow-purple-500 transition-shadow duration-200 ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-900'}`}
                                            />
                                        </div>

                                        <div className='w-full flex flex-col gap-1'>
                                            <label className='ml-3' htmlFor="">Description</label>
                                            <textarea
                                                type="text"
                                                placeholder='Enter Description'
                                                className={`flex flex-row justify-center resize-none items-end p-3 rounded-lg outline-none placeholder-neutral-500 focus:shadow-md focus:shadow-purple-500 transition-shadow duration-200 ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-900'}`}
                                                value={description}
                                                ref={textAreaRef}
                                                rows={3}
                                                onInput={() => {
                                                    const textArea = textAreaRef.current
                                                    if (textArea) {
                                                        textArea.style.height = 'auto'
                                                        textArea.style.height = `${textArea.scrollHeight}px`
                                                    }
                                                }}
                                                onChange={(e) => setDesciption(e.target.value)}

                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='flex justify-center items-center'>
                                    <button onClick={handleUpdateVideo} className={`text-2xl border-2 border-purple-600 transition-colors duration-100 hover:bg-purple-600 pb-2 pt-1 px-3`}>
                                        Update
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                )
            }

            {
                deletePopUp && (
                    <div className='fixed z-20 top-0 left-0 w-full h-screen flex justify-center items-center bg-opacity-30 bg-black '>
                        <div className={`w-11/12 md:w-1/2 xl:w-1/3 max-h-[90%]  relative flex flex-col gap-10 rounded-2xl px-10 py-10 ${theme === 'light' ? 'bg-neutral-200' : 'bg-neutral-800'}`}>

                            <div className={`absolute top-0 right-0 m-2 rounded-full p-0.5 ${theme === 'light' ? 'hover:bg-neutral-400' : 'hover:bg-neutral-700'}`}>
                                <IoMdClose className='text-3xl cursor-pointer' onClick={closeDeletePopUp} />
                            </div>

                            <div className={`w-full flex justify-center items-center ${theme === 'light' ? 'text-red-500' : 'text-red-700'} text-2xl sm:text-3xl`}>
                                Delete Video
                            </div>

                            <div className='flex flex-col gap-5 md:gap-10 overflow-y-auto'>
                                <div className={`text-center lg:text-lg py-2 rounded-xl ${theme === 'light' ? 'bg-red-400' : 'bg-red-600'}`}>
                                    Are you sure you want to delete this video?
                                </div>

                                <div className='w-full flex flex-col items-center gap-3'>
                                    <div className='w-full'>
                                        <img className='w-full rounded-xl object-cover' src={imagePreview} alt="" />
                                    </div>
                                    <div className='w-full px-2 text-2xl'>
                                        {title}
                                    </div>
                                </div>

                                <div className='flex justify-center items-center gap-3'>
                                    <button onClick={closeDeletePopUp} className={`text-2xl border-2 ${theme === 'light' ? 'border-neutral-400 hover:bg-neutral-400' : 'border-neutral-600 hover:bg-neutral-600'} transition-colors duration-100  pb-2 pt-1 px-3`}>
                                        Cancel
                                    </button>
                                    <button onClick={handleDeleteVideo} className={`text-2xl border-2 ${theme === 'light' ? 'border-red-500 hover:bg-red-500' : 'border-red-700 hover:bg-red-700'} transition-colors duration-100  pb-2 pt-1 px-3`}>
                                        Delete
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                )
            }

            {
                userChannel?._id && (
                    <div className='relative w-full h-60 lg:h-96 bg-slate-400 sm:rounded-xl'>
                        {
                            user?._id && userChannel?._id && (user?._id === userChannel?._id) && (
                                <label className='absolute w-full h-1/2 text-lg text-white hidden lg:flex justify-center items-end cursor-pointer lg:rounded-t-xl transition-all duration-100 bg-black opacity-0 bg-opacity-0 hover:opacity-100 hover:bg-opacity-30' htmlFor="coverImage-input">
                                    <span className='flex items-center gap-1 bg-neutral-600 px-2 py-0.5 rounded-lg'>
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                        <span>Choose File</span>
                                    </span>
                                </label>
                            )
                        }

                        {
                            user?._id && userChannel?._id && (user?._id === userChannel?._id) && (
                                <label htmlFor='coverImage-input' className='absolute bottom-1/2 -translate-y-1 right-1 lg:hidden flex justify-center items-center cursor-pointer sm:rounded-lg'>
                                    <span className='flex items-center gap-1 text-white bg-black bg-opacity-50 p-1.5 rounded-md'>
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                        {/* <span>Choose File</span> */}
                                    </span>
                                </label>
                            )
                        }

                        <input onChange={handleImageChange1} id='coverImage-input' className='hidden' type="file" accept='image/*' />
                        {
                            imagePreview1 && (
                                <img className='h-full w-full object-cover lg:rounded-xl' src={imagePreview1} alt="" />
                            )
                        }

                        {
                            !imagePreview1 && userChannel?.coverImage && (
                                <img className='h-full w-full object-cover lg:rounded-xl' src={userChannel?.coverImage} alt="" />
                            )
                        }

                        <div className='absolute h-1/2 w-full flex bottom-0 opacity-70 bg-black lg:rounded-b-xl'></div>

                        <div className='absolute h-1/2 w-full flex gap-3 sm:gap-10 bottom-0'>
                            {
                                user?._id && userChannel?._id && (user?._id === userChannel?._id) && (
                                    <label className='absolute aspect-[1/1] max-w-1/3 h-full text-sm lg:text-lg text-white hidden lg:flex justify-center items-center cursor-pointer rounded-full transition-all duration-100 bg-black opacity-0 bg-opacity-0 hover:opacity-100 hover:bg-opacity-30' htmlFor="profileImage-input">
                                        <span className='flex items-center gap-1 bg-neutral-600 px-2 py-0.5 rounded-md sm:rounded-lg'>
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                            <span>Choose File</span>
                                        </span>
                                    </label>
                                )
                            }

                            {
                                user?._id && userChannel?._id && (user?._id === userChannel?._id) && (
                                    <label htmlFor='profileImage-input' className='absolute bottom-1 left-28 -translate-x-2 lg:left-48 lg:hidden flex cursor-pointer sm:rounded-lg '>
                                        <span className='flex items-center gap-1 text-xs p-1 rounded-lg'>
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                            {/* <span>Choose File</span> */}
                                        </span>
                                    </label>
                                )
                            }

                            <input onChange={handleImageChange2} id='profileImage-input' className='hidden' type="file" accept='image/*' />

                            {
                                imagePreview2 && (
                                    <img className='object-cover rounded-full aspect-[1/1] max-w-1/3' src={imagePreview2} alt="" />
                                )
                            }
                            {
                                !imagePreview2 && userChannel?.avatar && (
                                    <img className='object-cover rounded-full aspect-[1/1] max-w-1/3' src={userChannel?.avatar} alt="" />
                                )
                            }

                            <div className='text-white flex flex-wrap items-center justify-between w-full mr-3 md:mr-10'>
                                <div className=''>
                                    <span className='text-2xl sm:text-4xl'>{userChannel?.username}</span>
                                    <span className='text-xs sm:text-xl flex flex-wrap'>{userChannel?.subscribersCount} Subscribers</span>
                                    <span className='text-xs sm:text-xl flex flex-wrap'>{userChannel?.channelsSubscribedToCount} Subscriptions</span>
                                </div>

                                <div>
                                    <button
                                        ref={subscribeButtonRef}
                                        onClick={handleSubscribe}
                                        className={`text-md sm:text-2xl w-28 sm:w-40 border-2 border-purple-600 ${userChannel?.isSubscribed ? 'bg-purple-600' : 'lg:hover:bg-purple-600'} transition-all duration-200 pb-1.5 sm:pb-2 pt-1 px-1 sm:px-3`}
                                    >
                                        {userChannel?.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                (imagePreview1 || imagePreview2) && (
                    <div className='w-full p-3 flex justify-center items-center'>
                        <button onClick={handleUpdate} className={`text-xl border-2 border-purple-600 transition-colors duration-100 hover:bg-purple-600 pb-2 pt-1 px-3`}>
                            Update
                        </button>
                    </div>
                )
            }

            {
                userChannel?._id && (
                    <div className='px-5 flex flex-col gap-5'>
                        <div className='flex justify-between'>
                            <div className='flex gap-2 sm:gap-5'>
                                <button className={`text-sm sm:text-xl px-2 sm:px-5 py-2 sm:py-3 rounded-lg ${sortBy === 'createdAt' ? 'text-purple-600' : ''} ${sortBy === 'createdAt' ? theme === 'light' ? 'bg-neutral-400' : 'bg-neutral-900' : theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-700'}`} onClick={() => setSortBy('createdAt')}>Latest</button>
                                <button className={`text-sm sm:text-xl px-2 sm:px-5 py-2 sm:py-3 rounded-lg ${sortBy === 'views' ? 'text-purple-600' : ''} ${sortBy === 'views' ? theme === 'light' ? 'bg-neutral-400' : 'bg-neutral-900' : theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-700'}`} onClick={() => setSortBy('views')}>Popular</button>
                            </div>
                            {
                                user?._id && userChannel?._id && (user?._id === userChannel?._id) && (
                                    <Link to='/upload' className={`text-sm sm:text-xl flex items-center gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors duration-100 hover:text-purple-600 ${theme === 'light' ? 'bg-neutral-300 hover:bg-neutral-400' : 'bg-neutral-700 hover:bg-neutral-900'}`}>
                                        <IoVideocam className='text-lg sm:text-2xl' />
                                        <span>Upload Video</span>
                                    </Link>
                                )
                            }
                        </div>
                        <div className='flex flex-wrap'>
                            {
                                videos?.videos?.map((video) => {
                                    return (
                                        <VideoCard3 userChannel={userChannel} video={video} key={video._id} openUpdatePopUp={openUpdatePopUp} openDeletePopUp={openDeletePopUp} />
                                    )
                                })
                            }
                        </div>
                    </div>
                )
            }

            <PaginationCard page={page} setPage={setPage} lastPage={videos.totalPages} />
        </div>
    )
}

export default ChannelPage