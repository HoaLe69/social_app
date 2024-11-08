import { useEffect } from 'react'
import { Box } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const RequireAuthentication = ({ children }) => {
  const navigate = useNavigate()
  const auth = JSON.parse(localStorage.getItem('user'))
  window.addEventListener('storage', () => {
    if (!auth) {
      navigate('/login')
    }
  })
  useEffect(() => {
    if (!auth) navigate('/login')
  }, [auth, navigate])
  return <Box>{children}</Box>
}

export default RequireAuthentication
