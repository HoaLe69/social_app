import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { verifyUser } from '../redux/api-request/user'
import { useDispatch, useSelector } from 'react-redux'

const RequireAuthentication = ({ children }) => {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(state => state.auth.authState.isAuthenticated)

  useEffect(() => {
    verifyUser(dispatch)
  }, [])

  if (isAuthenticated === false) return <Navigate to="/login" replace={true} />

  return children
}

export default RequireAuthentication
