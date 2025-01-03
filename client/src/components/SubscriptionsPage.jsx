import React, { useEffect, useState } from 'react'
import { useLoadingContext } from '../contexts/loadingContext'
import { useUserContext } from '../contexts/userContext'
import { usePopUpContext } from '../contexts/popUpContext';
import SubscriptionsCard from './SubscriptionsCard'
import PaginationCard from './PaginationCard'

function SubscriptionsPage() {
  const {user} = useUserContext()
  const { loading, setLoading } = useLoadingContext()
  const {setLoginPopUp} = usePopUpContext()

  const [subscriptions, setSubscriptions] = useState([])
  const [page, setPage] = useState(1)

  const getSubscriptions = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/subscription/?page=${page}`
    const options = {
      credentials: 'include'
    }

    fetch(url, options)
      .then((res) => res.json())
      .then((res) => {
        if (res.statusCode === 200) {
          setSubscriptions(res.data)
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
    setLoading(true)
    getSubscriptions()
  }, [])

  useEffect(() => {
    getSubscriptions()
  }, [page])

  if(!user?._id) {
    return (
      <div>
        
      </div>
    )
  }

  return (
    <div className='relative w-10/12 md:w-2/3 lg:w-1/2 flex flex-col gap-3 md:gap-5 mt-5 mb-14'>
      <div className={`w-full flex flex-col gap-5 px-4 py-2 rounded-lg `}>
        <span className='text-2xl'>Subscriptions</span>
      </div>

      {
        subscriptions.length !== 0 && subscriptions?.subscriptions?.length == 0 && (
          <div className='text-3xl w-full flex justify-center mt-10'>
            No videos found
          </div>
        )
      }

      {
        subscriptions?.subscriptions?.length > 0 && subscriptions?.subscriptions?.map((user) => {
          return (
            <SubscriptionsCard channel={user?.channel} key={user?._id} />
          )
        })
      }

      {
        subscriptions?.subscriptions?.length > 0 && (
          <PaginationCard page={page} setPage={setPage} lastPage={subscriptions.totalPages} />
        )
      }
    </div>
  )
}

export default SubscriptionsPage