import React, { useEffect, useState } from 'react'
import { useLoadingContext } from '../contexts/loadingContext'
import { useUserContext } from '../contexts/userContext'
import { usePopUpContext } from '../contexts/popUpContext'
import VideoCard1 from './VideoCard1'
import PaginationCard from './PaginationCard'

function LikedVideosPage() {
  const {user} = useUserContext()
  const {loading, setLoading} = useLoadingContext()
  const {setLoginPopUp} = usePopUpContext()

  const [videos, setVideos] = useState([])
  const [page, setPage] = useState(1)

  const getLikedVideos = async () => {
    setLoading(true)
    const url = `${import.meta.env.VITE_BACKEND_URL}/like/liked-videos?page=${page}`
    const options = {
      credentials: 'include'
    }

    fetch(url, options)
    .then((res) => res.json())
    .then((res) => {
      if(res.statusCode === 200) {
        setVideos(res.data)
        console.log(res.data)
      }
      else {
        setLoginPopUp(true)
      }
    })
    .catch((err) => console.log(err))
    .finally(() => setLoading(false))
  }

  useEffect(() => {
    getLikedVideos()
  }, [])

  if(!user?._id) {
    return (
      <div>
        
      </div>
    )
  }

  return (
    <div className='relative w-10/12 md:w-4/5 lg:w-2/3 flex flex-col gap-3 md:gap-5 mt-5 mb-14'>
      <div className={`w-full flex flex-col gap-5 px-4 py-2 rounded-lg `} style={{transition: '0.3s'}}>
        <span className='text-2xl'>Liked Videos</span>
      </div>

      {
        videos.length !== 0 && videos?.videos?.length == 0 && (
          <div className='text-3xl w-full flex justify-center mt-10'>
            No videos found
          </div>
        )
      }

      {
        videos.videos?.length > 0 && videos.videos?.map((video, index) => {
          return (
            <VideoCard1 video={video?.video} key={video._id} />
          )
        })
      }

      {
        videos.videos?.length > 0 && (
          <PaginationCard page={page} setPage={setPage} lastPage={videos.totalPages} />
        )
      }
    </div>
  )
}

export default LikedVideosPage