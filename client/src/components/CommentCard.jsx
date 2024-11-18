import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as heart1 } from '@fortawesome/free-solid-svg-icons';
import { faHeart as heart2 } from '@fortawesome/free-regular-svg-icons';

function CommentCard({ comment, setLike, setCommentId }) {
  const likeURL = `${import.meta.env.VITE_BACKEND_URL}/like/?commentId=${comment._id}`
  const [likes, setLikes] = useState([])

  const getLikes = async () => {
    fetch(likeURL)
      .then((res) => res.json())
      .then((res) => setLikes(res.data))
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    getLikes()
  }, [])

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
        <div className='flex justify-center items-center gap-3'>
          <FontAwesomeIcon className='cursor-pointer' icon={heart2} style={{ color: "#822eff", }} />
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