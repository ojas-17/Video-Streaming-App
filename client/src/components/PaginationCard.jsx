import React from 'react'
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useThemeContext } from '../contexts/themeContext';

function PaginationCard({page, setPage, lastPage}) {
    const {theme} = useThemeContext()

  return (
    <div className='w-full flex justify-center mt-5'>
        <div className='flex items-center gap-1'>
            <div  className={`text-2xl cursor-pointer aspect-square p-1 ${theme === 'light' ? 'bg-neutral-300 hover:bg-purple-600' : 'bg-neutral-700 hover:bg-purple-600'}`} onClick={() => setPage(1)}>
                <MdKeyboardDoubleArrowLeft />
            </div>
            <div  className={`text-2xl cursor-pointer aspect-square p-1 ${theme === 'light' ? 'bg-neutral-300 hover:bg-purple-600' : 'bg-neutral-700 hover:bg-purple-600'}`} onClick={() => setPage((prev) => prev > 1 ? prev-1 : prev)}>
                <MdKeyboardArrowLeft />
            </div>
            <div className='flex items-center text-xl px-2 pb-0.5'>{page} / {lastPage}</div>
            <div  className={`text-2xl cursor-pointer aspect-square p-1 ${theme === 'light' ? 'bg-neutral-300 hover:bg-purple-600' : 'bg-neutral-700 hover:bg-purple-600'}`} onClick={() => setPage((prev) => prev < lastPage ? prev+1 : prev)}>
                <MdKeyboardArrowRight />
            </div>
            <div  className={`text-2xl cursor-pointer aspect-square p-1 ${theme === 'light' ? 'bg-neutral-300 hover:bg-purple-600' : 'bg-neutral-700 hover:bg-purple-600'}`} onClick={() => setPage(lastPage)}>
                <MdKeyboardDoubleArrowRight />
            </div>
        </div>
    </div>
  )
}

export default PaginationCard