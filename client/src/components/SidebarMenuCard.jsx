import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useThemeContext } from '../contexts/themeContext'

function SidebarMenuCard({ children, to }) {
    const [isHovered, setIsHovered] = useState(false)

    const { theme } = useThemeContext()

    return (
        <NavLink
        to={to}
        className={({isActive}) => `flex items-center gap-3 cursor-pointer py-4 px-3 rounded-lg text-xl ${isHovered ? theme === 'light' ? 'bg-neutral-400 text-purple-600' : 'bg-neutral-900 text-purple-600' : ''} ${isActive ? theme === 'light' ? 'bg-neutral-400 text-purple-600' : 'bg-neutral-900 text-purple-600' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </NavLink>
    )
}

export default SidebarMenuCard