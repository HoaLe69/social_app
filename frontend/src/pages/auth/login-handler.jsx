import { Box, Text, Spinner, Link, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useNavigate, Link as ReactRouterLink } from 'react-router-dom'
import { getUserProfileFromGoogle, authWithSocial } from '../../redux/api-request/auth'

const LoginHandler = () => {
  const navigate = useNavigate()
  const [error, setError] = useState(false)

  //get google access token from url
  const extractDataFromURL = key => {
    const searchParams = window.location.search
    const urlParams = new URLSearchParams(searchParams)
    return urlParams.get(key)
  }
  const code = extractDataFromURL('code')

  useEffect(() => {
    if (!code) {
      setError(true)
      return
    }

    const authenticate = async () => {
      try {
        const userInfo = await getUserProfileFromGoogle(code)
        await authWithSocial(userInfo)
        setError(false)
        navigate('/', { replace: true })
      } catch (error) {
        console.error(error)
        setError(true)
      }
    }
    authenticate()
  }, [])
  return (
    <Box display="flex" alignItems="center" justifyContent="center" height="100vh" overflow="hidden" gap="4">
      {error ? (
        <VStack>
          <Text fontSize="2xl" fontWeight="bold">
            Opp !!, Something went wrong 🥶
          </Text>
          <Link fontSize="xl" as={ReactRouterLink} to="/login" color="teal.500" variant="underline">
            Back to Login
          </Link>
        </VStack>
      ) : (
        <>
          <Spinner size="lg" color="teal.500" borderWidth="4px" />
          <Text fontSize="2xl" fontWeight="bold">
            It take a while, Let chill 👀
          </Text>
        </>
      )}
    </Box>
  )
}

export default LoginHandler
