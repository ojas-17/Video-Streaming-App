import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import VideoPage from './components/VideoPage.jsx'
import SearchPage from './components/SearchPage.jsx'
import ChannelPage from './components/ChannelPage.jsx'
import LoginPage from './components/LoginPage.jsx'
import SignUpPage from './components/SignUpPage.jsx'
import TrendingPage from './components/TrendingPage.jsx'
import HistoryPage from './components/HistoryPage.jsx'
import SubscriptionsPage from './components/SubscriptionsPage.jsx'
import AccountPage from './components/AccountPage.jsx'
import NotAvailablePage from './components/NotAvailablePage.jsx' 
import { ThemeProvider } from './contexts/themeContext';
import { UserProvider } from './contexts/userContext';
import { PopUpProvider } from './contexts/popUpContext.js'
import { LoadingProvider } from './contexts/loadingContext.js'
import HomePage from './components/HomePage.jsx'
import LikedVideosPage from './components/LikedVideosPage.jsx'
import UploadPage from './components/UploadPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <HomePage />
      },
      {
        path: 'watch/:videoId',
        element: <VideoPage />
      },
      {
        path: 'search',
        element: <SearchPage />
      },
      {
        path: 'channel/:username',
        element: <ChannelPage />
      },
      {
        path: 'trending',
        element: <TrendingPage />
      },
      {
        path: 'history',
        element: <HistoryPage />
      },
      {
        path: 'subscriptions',
        element: <SubscriptionsPage />
      },
      {
        path: 'liked-videos',
        element:<LikedVideosPage />
      },
      {
        path: 'account',
        element: <AccountPage />
      },
      {
        path: '/upload',
        element: <UploadPage />
      },
      {
        path: 'error',
        element: <NotAvailablePage />
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/signup',
    element: <SignUpPage />
  }
])

const Root = () => {
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState({});
  const [prevPage, setPrevPage] = useState('/')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [msg, setMsg] = useState('')
  const [account, setAccount] = useState(false)
  const [loginPopUp, setLoginPopUp] = useState(false)
  const [like, setLike] = useState(false)

  return (
    <ThemeProvider value={{ theme, setTheme }}>
      <UserProvider value={{ user, setUser, prevPage, setPrevPage }}>
        <PopUpProvider value={{ account, setAccount, like, setLike, loginPopUp, setLoginPopUp }}>
          <LoadingProvider value={{ loading, setLoading, errorMsg, setErrorMsg, msg, setMsg }}>
           <RouterProvider router={router} />
          </LoadingProvider>
        </PopUpProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

createRoot(document.getElementById('root')).render(
  <Root />
)
