import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import authUtils from '../../utils/authUtils'
import Loading from '../common/Loading'
import { Box } from '@mui/material'
import Sidebar from '../common/Sidebar';
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/features/userSlice'

const AppLayout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
          const user = await authUtils.isAuthenticated()
          if(!user){
            navigate('/login')
          } else{
            dispatch(setUser(user))
            setLoading(false)
          }
        }
        checkAuth()
    }, [navigate])

  return (
    loading ? (
      <Loading fullHeight />
    ) : (
      <Box sx={{
        display: 'flex',
      }}>
        <Sidebar />
        <Box sx={{
          flexGrow: 1,
          p: 1,
          width: 'max-content'
        }}>
          <Outlet />
        </Box>
      </Box>
    )
  )
}

export default AppLayout