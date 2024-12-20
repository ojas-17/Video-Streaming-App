import React, { useEffect, useState } from 'react'
import { usePopUpContext } from '../contexts/popUpContext'
import { useThemeContext } from '../contexts/themeContext'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const LikeCard = ({ likeEl }) => {
    return (
        <Link className='flex items-center gap-3' to={`/channel/${likeEl.likedBy.username}`}>
            {/* <Link className='flex items-center gap-3' to={``}> */}
            <img className='aspect-[1/1] object-cover w-10 rounded-full' src={likeEl.likedBy.avatar} />
            <div>{likeEl.likedBy.username}</div>
            {/* <div>{likeEl}</div> */}
        </Link>
    )
}

function LikePopUp({ videoId2, setVideoId2, commentId, setCommentId }) {
    const { like, setLike } = usePopUpContext()
    const { theme } = useThemeContext()
    const [likes, setLikes] = useState([])
    const [page, setPage] = useState(1)
    const arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

    const closeLikePopUp = async () => {
        setLikes([])
        setCommentId('')
        setVideoId2('')
        setLike(false)
    }

    const [showLikeCard, setShowLikeCard] = useState(false)

    useEffect(() => {
        if (commentId || videoId2) {
            let url;
            console.log(commentId, videoId2)
            if (commentId)
                url = `${import.meta.env.VITE_BACKEND_URL}/like?commentId=${commentId}`
            else if (videoId2)
                url = `${import.meta.env.VITE_BACKEND_URL}/like?videoId=${videoId2}`

            fetch(url)
                .then((res) => res.json())
                .then((res) => setLikes(res.data.likes))
                .catch((err) => console.log(err))
        }

    }, [page, like])

    useEffect(() => {
        if(like) {
            setTimeout(() => {
                setShowLikeCard(true)
            }, 100);
        }
        else {
            setShowLikeCard(false)
        }
    }, [like])

    // if (like) return (
    //     <div className={`fixed z-20 top-0 left-0 w-full h-full hidden sm:flex sm:items-center justify-center xl:justify-start ${like ? '' : 'hidden'}`} onClick={closeLikePopUp}>
    //         <div
    //             className={`z-30 fixed xl:left-[63%] w-4/5 sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/5 h-3/4 px-5 py-3 gap-3 rounded-lg flex flex-col overflow-y-auto scrollbar scrollbar-thin ${theme === 'light' ? 'bg-neutral-400' : 'bg-neutral-950'} text-xl`}
    //             onClick={(e) => e.stopPropagation()}
    //         >
    //             <span className='flex justify-between text-xl mb-2'>
    //                 <span>Liked By</span>
    //                 <div>
    //                     <FontAwesomeIcon className=' cursor-pointer' icon={faXmark} onClick={closeLikePopUp} />
    //                 </div>
    //             </span>
    //             {
    //                 likes.map((likeEl) => {
    //                     return (
    //                         <LikeCard likeEl={likeEl} key={likeEl._id} />
    //                     )
    //                 })
    //             }
    //         </div>
    //     </div>
    // )

    return (
        <div>
            <div className={`fixed z-20 top-0 left-0 w-full h-full hidden sm:items-center justify-center xl:justify-start ${like ? 'sm:flex' : 'hidden'}`} onClick={closeLikePopUp}>
                <div
                    className={`z-30 fixed xl:left-[63%] w-4/5 sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/5 h-[60%] xl:h-3/4 px-5 py-3 gap-3 rounded-lg flex flex-col overflow-y-auto scrollbar scrollbar-thin ${theme === 'light' ? 'bg-neutral-400' : 'bg-neutral-950'} text-xl ${like ? '' : 'hidden'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <span className='flex justify-between text-xl mb-2'>
                        <span>Liked By</span>
                        <div>
                            <FontAwesomeIcon className=' cursor-pointer' icon={faXmark} onClick={closeLikePopUp} />
                        </div>
                    </span>
                    {
                        likes.map((likeEl) => {
                            return (
                                <LikeCard likeEl={likeEl} key={likeEl._id} />
                            )
                        })
                    }
                </div>
            </div>

            <div className={`fixed z-20 top-0 left-0 w-full h-full sm:hidden flex sm:items-center justify-center xl:justify-start ${like ? '' : 'hidden'}`} onClick={closeLikePopUp}>
                <div
                    className={`z-30 fixed xl:left-[63%] bottom-0 w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/5 h-2/3 sm:h-3/4 px-5 py-3 gap-3 rounded-lg flex flex-col overflow-y-auto scrollbar scrollbar-thin ${theme === 'light' ? 'bg-neutral-400' : 'bg-neutral-950'} text-xl transition-all duration-300 ${showLikeCard ? 'translate-y-1' : 'translate-y-full'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <span className='flex justify-between text-xl mb-2'>
                        <span>Liked By</span>
                        <div>
                            <FontAwesomeIcon className=' cursor-pointer' icon={faXmark} onClick={closeLikePopUp} />
                        </div>
                    </span>
                    {
                        likes.map((likeEl) => {
                            return (
                                <LikeCard likeEl={likeEl} key={likeEl._id} />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default LikePopUp