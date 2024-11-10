import {
  FormLabel,
  Input,
  FormControl,
  VStack,
  Heading,
  Text,
  Button,
  useColorModeValue,
  Box,
  Link,
  Alert,
  AlertIcon
} from '@chakra-ui/react'
import AuthWrap from './auth-wrap'
import styled from '@emotion/styled'
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { login } from '@redux/api-request/auth'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import GoogleIcon from '../../components/icons/GoogleIcon'
import { useGoogleLogin } from '@react-oauth/google'

const FormStyled = styled.form`
  width: 400px;
  padding: 0 20px;
`

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isLoadingLogin = useSelector(state => state.auth.loginState.isFetching)
  const message = useSelector(state => state.auth.loginState.message)
  const formik = useFormik({
    initialValues: {
      userName: '',
      password: ''
    },
    onSubmit: formData => {
      login(dispatch, navigate, formData)
    }
  })
  const googleAuthorizeURL = useCallback(token => {
    return `http://localhost:3000/login/redirect/google?code=${token}`
  }, [])
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: tokenResponse => {
      window.location.assign(googleAuthorizeURL(tokenResponse?.access_token))
    }
  })

  const textColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.300')
  const inputColor = useColorModeValue('whiteAlpha.900', 'whiteAlpha.300')
  const textActiveColor = useColorModeValue('blue.500', 'pink.400')
  return (
    <AuthWrap>
      <FormStyled onSubmit={formik.handleSubmit}>
        <Box mb={3}>
          <Heading textAlign="center">Welcome back</Heading>
          <Text textAlign="center" color={textColor} mt={2}>
            We've missed you! Please sign in to catch up on what you've missed
          </Text>
        </Box>
        <VStack spacing={6} align="flex-start">
          <FormControl>
            <FormLabel htmlFor="userName">Username</FormLabel>
            <Input
              type="text"
              variant="filled"
              placeholder="Enter your name..."
              name="userName"
              id="userName"
              _focus={{
                backgroundColor: `${inputColor}`
              }}
              onChange={formik.handleChange}
              value={formik.values.userName}
            />
          </FormControl>
          <FormControl w="full">
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password..."
              name="password"
              variant="filled"
              id="password"
              _focus={{
                backgroundColor: `${inputColor}`
              }}
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="1px"
              borderColor="gray.700"
              height="0"
              my="8"
            >
              <Text bg="#202023" p={2} textColor="grey">
                Login with other
              </Text>
            </Box>
            <Button gap={2} width="full" onClick={handleGoogleLogin}>
              <GoogleIcon />
              Login With Google
            </Button>
          </FormControl>
          {message && (
            <Alert status="error">
              <AlertIcon />
              {message}
            </Alert>
          )}
          <Button type="submit" isLoading={isLoadingLogin} loadingText="Sign in" colorScheme="teal" width="full">
            Sign in
          </Button>
        </VStack>
        <Text mt={4} textAlign="center">
          Don't have account yet ?{' '}
          <Link as={ReactRouterLink} color={textActiveColor} to="/register">
            Sign up{' '}
          </Link>{' '}
          now to join our community
        </Text>
      </FormStyled>
    </AuthWrap>
  )
}

export default Login
