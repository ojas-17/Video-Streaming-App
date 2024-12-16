import React, { useEffect, useRef, useState } from 'react'
import { useThemeContext } from '../contexts/themeContext'
import { IoIosArrowDown } from "react-icons/io";


function AccountPageMenuItem({ title, showButton, children }) {
    const { theme } = useThemeContext()
    const [isOpen, setIsOpen] = useState(false)
    const contentRef = useRef()
    const [contentHeight, setContentHeight] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    const toggleOpen = () => {
        setIsOpen((prev) => !prev)
    }

    useEffect(() => {
        if(contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight)
        }
    }, [isOpen, showButton])

    return (
        <div className={`w-full flex flex-col px-4 py-2 rounded-lg ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-900'}`}>
            <div
            onClick={toggleOpen}
            className={`w-full flex justify-between cursor-pointer py-2`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            >
                <div className='text-base md:text-xl'>{title}</div>
                <IoIosArrowDown className={`text-2xl transition-transform duration-300 ease-out ${isHovered ? 'text-purple-600' : ''} ${isOpen ? 'rotate-180' : ''}`}/>
            </div>


            <div ref={contentRef} style={{ maxHeight: isOpen ? contentHeight : 0 }} className={`transition-all duration-300 overflow-hidden `}>
                {children}
            </div>

        </div>
    )
}

export default AccountPageMenuItem