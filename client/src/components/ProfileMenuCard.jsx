import React, { useState } from 'react'
import { useThemeContext } from '../contexts/themeContext'
import { Link } from 'react-router-dom'
import { usePopUpContext } from '../contexts/popUpContext'

function ProfileMenuCard({ children, onClick=() => {}}) {
    const [isHovered, setIsHovered] = useState(false)

    const { theme } = useThemeContext()
    const { setAccount } = usePopUpContext()

    return (
        <div
        className={`flex items-center gap-3 cursor-pointer rounded-md transition-colors p-2 duration-100 ${isHovered ? 'text-purple-600' : ''} ${isHovered ? theme === 'light' ? 'bg-neutral-400' : 'bg-neutral-950' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
            setAccount(false)
            onClick()
        }}
        >
            {children}
        </div>
    )
}

export default ProfileMenuCard