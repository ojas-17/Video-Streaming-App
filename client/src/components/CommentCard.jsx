import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as heart1 } from '@fortawesome/free-solid-svg-icons';
import { faHeart as heart2 } from '@fortawesome/free-regular-svg-icons';
import { useUserContext } from '../contexts/userContext';
import { useLoadingContext } from '../contexts/loadingContext';
import { usePopUpContext } from '../contexts/popUpContext';

function CommentCard({ comment, setLike, setCommentId }) {
  const { user } = useUserContext()
  const { setLoginPopUp } = usePopUpContext()
  
  const [likes, setLikes] = useState([])
  const [isLiked, setIsLiked] = useState(false)
  const likeIconRef = useRef()

  const getLikes = async () => {
    const likeURL = user?._id ? `${import.meta.env.VITE_BACKEND_URL}/like/?commentId=${comment._id}&userId=${user?._id}` : `${import.meta.env.VITE_BACKEND_URL}/like/?commentId=${comment._id}`
    fetch(likeURL)
      .then((res) => res.json())
      .then((res) => {
        if(res.statusCode === 200) {
          setIsLiked(res.data.isLiked)
          setLikes(res.data)
        }
      })
      .catch((err) => console.log(err))
  }

  const toggleLike = async () => {
    if (!user._id) {
      setLoginPopUp(true)
    }
    else {
      const url = `${import.meta.env.VITE_BACKEND_URL}/like?commentId=${comment?._id}`
      const options = {
        method: 'POST',
        credentials: 'include'
    }
      fetch(url, options)
        // .then((res) => res.json())
        .then((res) => {
          getLikes()
          console.log(res.status)
          setIsLiked(res.status === 201 ? true : false)
          if (res.status === 201) {
            likeIconRef.current.style.width = '20px'
            likeIconRef.current.style.height = '20px'
            setTimeout(() => {
              likeIconRef.current.style.width = ''
              likeIconRef.current.style.height = ''
            }, 150);
          }
        })
        .catch((err) => console.log(err))
    }
  }

  useEffect(() => {
    getLikes()
  }, [user])

  return (
    <div className='w-full flex'>
      <div className='flex w-full gap-2'>
        <Link to={`/channel/${comment?.owner?.username}`} >
          <img src={comment?.owner?.avatar} className='w-12 rounded-full border-2 border-purple-600 object-cover' style={{ aspectRatio: 1 / 1 }} alt="" />
        </Link>
        <div className='flex flex-col justify-between'>
          <Link to={`/channel/${comment?.owner?.username}`}>{comment?.owner?.username}</Link>
          <span>{comment?.content}</span>
        </div>
      </div>

      <div className='flex flex-col justify-evenly items-center min-w-20'>
        <div onClick={toggleLike} className='flex justify-center items-center gap-3'>
          <FontAwesomeIcon ref={likeIconRef} className='cursor-pointer transition-all duration-150 ease-out' icon={isLiked ? heart1 : heart2} style={{ color: "#822eff", }} />
          <div>{likes?.totalLikes}</div>
        </div>
        <div className='text-xs cursor-pointer transition-colors duration-150 hover:text-purple-500' onClick={() => {
          setCommentId(comment._id)
          setLike(true)
        }}>
          View Likes
        </div>
      </div>
    </div>
  )
}

export default CommentCard