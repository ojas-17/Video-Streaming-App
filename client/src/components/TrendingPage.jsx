import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import VideoCard1 from './VideoCard1'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { useThemeContext } from '../contexts/themeContext';

function TrendingPage() {
  const location = useLocation()

  const {theme} = useThemeContext()
  
  let query = ''
  const [videos, setVideos] = useState([])
  const [filterMenu, setFilterMenu] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortType, setSortType] = useState('desc')

  const toggleFilterMenu = () => {
    setFilterMenu((prev) => !prev)
  }

  const getVideo = async (query, sortBy, sortType) => {
    const queryParams = new URLSearchParams(location.search)
    // console.log(query)

    query = queryParams.get('query')
    const url = query ? `${import.meta.env.VITE_BACKEND_URL}/video/?title=${query}&sortBy=${sortBy}&sortType=${sortType}` : `${import.meta.env.VITE_BACKEND_URL}/video/`

    // console.log(query)
    // console.log(sortBy)
    // console.log(sortType)
    // console.log(url)
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.data)
      .then((data) => {
        setVideos(data.videos)
        // console.log(data.videos)
      })
      .catch((error) => {
        console.log(error)
        setVideos([])
      })
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    query = queryParams.get('query')
    setSortBy('createdAt')
    setSortType('desc')
    setFilterMenu(false)
    // console.log('check', query)
    
    getVideo(query, 'createdAt', 'desc')
  }, [location.search])


  return (
    <div className='relative w-10/12 md:w-4/5 lg:w-2/3 flex flex-col gap-3 md:gap-5 mt-5'>
      <div className={`w-full flex flex-col gap-5 px-4 py-2 rounded-lg ${filterMenu ? theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-950' : ''} ${filterMenu ? 'h-48' : 'h-8'}`} style={{transition: '0.3s'}}>
        <span className='text-2xl'>Trending Videos</span>
      </div>

      {
        !videos?.length && (
          <div className='text-3xl w-full flex justify-center mt-10'>
            No videos found
          </div>
        )
      }

      {
        videos.map((video) => {
          return (
            <VideoCard1 video={video} key={video._id} />
          )
        })
      }
    </div>
  )
}

export default TrendingPage