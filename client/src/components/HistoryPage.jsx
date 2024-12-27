import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import VideoCard1 from './VideoCard1'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { useThemeContext } from '../contexts/themeContext';
import { useUserContext } from '../contexts/userContext';
import { useLoadingContext } from '../contexts/loadingContext';
import { usePopUpContext } from '../contexts/popUpContext';
import PaginationCard from './PaginationCard'

function HistoryPage() {
  const location = useLocation()

  const {user} = useUserContext()
  const {theme} = useThemeContext()
  const {loading, setLoading} = useLoadingContext()
  const {setLoginPopUp} = usePopUpContext()
  
  let query = ''
  const [videos, setVideos] = useState([])
  const [filterMenu, setFilterMenu] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortType, setSortType] = useState('desc')
  const [page, setPage] = useState(1)

  const toggleFilterMenu = () => {
    setFilterMenu((prev) => !prev)
  }

  const getVideo = async () => {
    const queryParams = new URLSearchParams(location.search)
    // console.log('q=', query)

    query = queryParams.get('query')
    // const url = query ? `${import.meta.env.VITE_BACKEND_URL}/video/?title=${query}&sortBy=${sortBy}&sortType=${sortType}` : `${import.meta.env.VITE_BACKEND_URL}/video/`
    
    const limit = 10
    const url = `${import.meta.env.VITE_BACKEND_URL}/users/history?page=${page}&limit=${limit}`
    const options = {
      credentials: 'include'
    }

    // console.log(query)
    // console.log(sortBy)
    // console.log(sortType)
    // console.log(url)
    fetch(url, options)
      .then((res) => res.json())
      // .then((res) => res.data)
      .then((res) => {
        if(res.statusCode === 200) {
          setVideos(res?.data)
        }
        else {
          setLoginPopUp(true)
        }
        console.log(res?.data)
      })
      .catch((error) => {
        console.log(error)
        setVideos([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    setLoading(true)
    const queryParams = new URLSearchParams(location.search)
    query = queryParams.get('query')
    setSortBy('createdAt')
    setSortType('desc')
    setFilterMenu(false)
    // console.log('check', query)
    
    getVideo()
  }, [location.search])

  useEffect(() => {
    getVideo()
  }, [page])

  if(!user?._id) {
    return (
      <div>

      </div>
    )
  }

  return (
    <div className='relative w-10/12 md:w-4/5 lg:w-2/3 flex flex-col gap-3 md:gap-5 mt-5 mb-14'>
      <div className={`w-full flex flex-col gap-5 px-4 py-2 rounded-lg ${filterMenu ? theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-950' : ''} `} style={{transition: '0.3s'}}>
        <span className='text-2xl'>Watch History</span>
      </div>

      {
        videos.length !== 0 && videos?.watchHistory?.length == 0 && (
          <div className='text-3xl w-full flex justify-center mt-10'>
            No videos found
          </div>
        )
      }

      {
        videos.watchHistory?.length > 0 && videos.watchHistory?.map((video, index) => {
          return (
            <VideoCard1 video={video} key={index} />
          )
        })
      }

      {
        videos.watchHistory?.length > 0 && (
          <PaginationCard page={page} setPage={setPage} lastPage={videos.totalPages} />
        )
      }
    </div>
  )
}

export default HistoryPage