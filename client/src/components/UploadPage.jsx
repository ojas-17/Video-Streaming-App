import React, { useEffect, useRef, useState } from 'react'
import { useThemeContext } from '../contexts/themeContext'
import { useLoadingContext } from '../contexts/loadingContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import VideoPlayer from './VideoPlayer';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/userContext';
import loading1 from '../assets/loading.gif'
import loading2 from '../assets/loading2.gif'

function UploadPage() {
    const { theme } = useThemeContext()
    const { user } = useUserContext()
    const { loading, setLoading, setErrorMsg, setMsg } = useLoadingContext()
    const textAreaRef = useRef(null)
    const [title, setTitle] = useState('')
    const [description, setDesciption] = useState('')

    const navigate = useNavigate()

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

    const [video, setVideo] = useState(null)
    const [videoPreview, setVideoPreview] = useState(null)
    const [showUploadProgress, setShowUploadProgress] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    const videoJsOptions = {
        autoplay: true,
        controls: true,
        // responsive: true,
        // fluid: true,
        sources: [{
            src: videoPreview,
            type: 'video/mp4'
        }]
    }

    const handleVideoChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setVideo(file);

            const videoUrl = URL.createObjectURL(file); // Create a URL for the video
            setVideoPreview(videoUrl); // Set the video preview
        }
    }

    // const UploadToCloudinary = async (file) => {
    //     const formData = new FormData();
    //     formData.append('file', file);
    //     formData.append('upload_preset', 'frontend_unsigned_upload_preset');

    //     try {
    //         const response = await fetch('https://api.cloudinary.com/v1_1/daz3h4k3g/auto/upload', {
    //             method: 'POST',
    //             body: formData,
    //         });
    //         const data = await response.json();
    //         console.log('Uploaded file metadata:', data);
    //         return data;
    //     } catch (error) {
    //         console.error('Upload error:', error);
    //     }
    // };

    const UploadToCloudinary = (file) => {
        return new Promise((resolve, reject) => {
            setShowUploadProgress(true)

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'frontend_unsigned_upload_preset');

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://api.cloudinary.com/v1_1/daz3h4k3g/auto/upload');

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    // if((percent >= 0) && (percent <= 100)) {
                    //     setUploadProgress(percent)
                    // }
                    setUploadProgress(percent)
                    console.log(`Upload progress: ${percent}%`);
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);
                    console.log('Uploaded file metadata:', data);
                    setShowUploadProgress(false)
                    resolve(data);
                } else {
                    setShowUploadProgress(false)
                    reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            };

            xhr.onerror = () => reject(new Error('Network error during upload'));

            xhr.send(formData);
        });
    };


    const handleUpload = async () => {
        if (!video) {
            setErrorMsg('Video File is required')
            setTimeout(() => {
                setErrorMsg('')
            }, 2000);
        }
        else if (!image) {
            setErrorMsg('Thumbnail File is required')
            setTimeout(() => {
                setErrorMsg('')
            }, 2000);
        }
        else if (!title) {
            setErrorMsg('Title is required')
            setTimeout(() => {
                setErrorMsg('')
            }, 2000);
        }
        else if (!description) {
            setErrorMsg('Description is required')
            setTimeout(() => {
                setErrorMsg('')
            }, 2000);
        }

        else {
            const url = `${import.meta.env.VITE_BACKEND_URL}/video/upload`

            const uploadedVideo = await UploadToCloudinary(video)

            setLoading(true)

            const formData = new FormData()
            formData.append('videoUrl', uploadedVideo.secure_url)
            formData.append('videoDuration', uploadedVideo.duration)
            formData.append('thumbnail', image)
            formData.append('title', title)
            formData.append('description', description)

            const options = {
                method: 'POST',
                body: formData,
                credentials: 'include'
            }

            fetch(url, options)
                .then((res) => res.json())
                .then((res) => {
                    // console.log(res)
                    if (res.statusCode === 201) {
                        setMsg(res.message)
                        if (user?._id) {
                            navigate(`/channel/${user?.username}`)
                        }
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
                .finally(() => setLoading(false))

            // setMsg('Success')
            // setTimeout(() => {
            //     setMsg('')
            // }, 2000);



        }

    }


    return (
        <div className={`w-5/6 flex flex-col gap-10 pt-5 pb-10 mb-10`}>
            {
                loading && (
                    <div className='fixed z-10 top-0 left-0 w-full h-screen bg-black opacity-30'></div>
                )
            }

            {
                showUploadProgress && (
                    <div className='fixed flex flex-col justify-center items-center gap-2 z-10 top-0 left-0 w-full h-screen'>
                        <div className='absolute top-0 left-0 w-full h-screen bg-black opacity-30'></div>

                        <div className='z-20 text-2xl flex justify-center items-center gap-2'>
                            <img src={theme === 'light' ? loading1 : loading2} className='aspect-[1/1]' style={{width: '30px'}} alt="" />
                            <div> Uploading ({uploadProgress}%) </div>
                        </div>
                        <div className='w-3/4 sm:w-1/2 lg:w-1/3 xl:w-1/4 z-20'>
                            <div className='w-full h-10 border-2 border-purple-700 rounded-full overflow-hidden'>
                                <div className='h-full bg-gradient-to-r from-purple-500 to-blue-600 rounded-full transition-all duration-300' style={{width: `${uploadProgress}%`}}>

                                </div>
                            </div>

                            {/* <div className="w-full h-10 border-2 border-purple-700 rounded-full overflow-hidden relative bg-transparent">
                                <div
                                    className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-purple-500 to-blue-600"
                                    style={{
                                        maskImage: `linear-gradient(to right, black ${uploadProgress}%, transparent ${uploadProgress}%)`,
                                        WebkitMaskImage: `linear-gradient(to right, black ${uploadProgress}%, transparent ${uploadProgress}%)`,
                                        maskRepeat: 'no-repeat',
                                        WebkitMaskRepeat: 'no-repeat',
                                        maskSize: '100% 100%',
                                        WebkitMaskSize: '100% 100%',
                                        borderRadius: '9999px' // Force the mask to be rounded as well
                                    }}
                                />
                            </div> */}

                        </div>
                    </div>
                )
            }


            <div className='text-center text-4xl'>
                Upload Video
            </div>
            <div className='w-full flex flex-wrap justify-between gap-10 md:gap-0'>
                <div className='w-full md:w-[48%] lg:w-[45%] flex flex-col gap-3'>
                    <div className={`w-full aspect-[16/9] relative rounded-xl ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-900'} hover:shadow-lg hover:shadow-purple-500 transition-shadow duration-200`}>
                        <label htmlFor="video-file" className={`w-full h-full absolute rounded-xl flex justify-center items-center gap-1 cursor-pointer transition-all duration-100 bg-black bg-opacity-0 hover:bg-opacity-50 opacity-0 hover:opacity-100 ${!videoPreview ? 'opacity-100' : ''}`}>
                            <FontAwesomeIcon icon={faPenToSquare} />
                            <span>Choose File</span>
                        </label>
                        <input id='video-file' type="file" accept='video/*' className='hidden' onChange={handleVideoChange} />
                        {
                            videoPreview && (
                                <VideoPlayer options={videoJsOptions} />
                            )
                        }
                    </div>
                    <div className='flex justify-center items-center text-xl'>
                        {
                            videoPreview ? (
                                <label htmlFor="video-file" className={`rounded-xl p-2 flex justify-center items-center gap-1 cursor-pointer transition-all duration-100 bg-black bg-opacity-0 hover:bg-opacity-50`}>
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                    <span>Choose Video File</span>
                                </label>
                            ) : (
                                <span>Video File</span>
                            )
                        }
                    </div>
                </div>

                <div className='w-full md:w-[48%] lg:w-[45%] flex flex-col gap-3'>
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

            </div>

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
                <label className='ml-3' htmlFor="">Desciption</label>
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

            <div className='w-full flex justify-center items-center'>
                <button onClick={handleUpload} className={`text-2xl border-2 border-purple-600 transition-colors duration-100 hover:bg-purple-600 pb-2 pt-1 px-3`}>
                    Upload
                </button>
            </div>

        </div>
    )
}

export default UploadPage