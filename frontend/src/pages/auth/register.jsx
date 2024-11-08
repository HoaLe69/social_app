import AuthWrap from './auth-wrap'
import {
  Box,
  Input,
  FormControl,
  Link,
  FormLabel,
  VStack,
  Button,
  Text,
  Heading,
  FormErrorMessage,
  useColorModeValue,
  Alert,
  AlertIcon
} from '@chakra-ui/react'
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '@redux/api-request/auth'
import VerifyEmail from './verify-email'

const FormStyled = styled.form`
  width: 400px;
  padding: 0 20px;
`

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoadingRegister = useSelector(state => state.auth.register.isFetching)
  const isSuccess = useSelector(state => state.auth.register.success)
  const message = useSelector(state => state.auth.register.message)
  const formik = useFormik({
    initialValues: {
      userName: '',
      email: '',
      password: ''
    },
    onSubmit: formData => {
      register(dispatch, navigate, formData)
    },
    validationSchema: Yup.object({
      userName: Yup.string().max(20, 'Maximum 20 characters').min(6, 'Minimum 6 characters').required('Required'),
      email: Yup.string()
        .max(50, 'Maximum 50 character')
        .required('Required')
        .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter valid email address'),
      password: Yup.string()
        .required('Required')
        .min(6, 'Minimun 6 characters')
        .matches(/(?=.*\d)(?=.*[a-zA-Z]).*/, 'Include least one letter, one number')
    })
  })
  const textColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.300')
  const inputColor = useColorModeValue('whiteAlpha.900', 'whiteAlpha.300')
  const textActiveColor = useColorModeValue('blue.500', 'pink.400')
  return (
    <AuthWrap>
      {!isSuccess ? (
        <FormStyled onSubmit={formik.handleSubmit}>
          <Box mb={3}>
            <Heading textAlign="center">Welcome to Penguin</Heading>
            <Text textAlign="center" color={textColor} mt={2}>
              We've missed you! Please sign in to catch up on what you've missed
            </Text>
          </Box>
          <VStack spacing={6} align="flex-start">
            <FormControl isInvalid={formik.errors.userName}>
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
              {formik.errors.userName && <FormErrorMessage>{formik.errors.userName}</FormErrorMessage>}
            </FormControl>
            <FormControl isInvalid={formik.errors.email}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                type="email"
                variant="filled"
                placeholder="Enter your email..."
                name="email"
                id="email"
                _focus={{
                  backgroundColor: `${inputColor}`
                }}
                onChange={formik.handleChange}
                value={formik.values.email}
              />

              {formik.errors.email && <FormErrorMessage>{formik.errors.email}</FormErrorMessage>}
            </FormControl>
            <FormControl isInvalid={formik.errors.password}>
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
              {formik.errors.password && <FormErrorMessage>{formik.errors.password}</FormErrorMessage>}
            </FormControl>
            {message && (
              <Alert status="error">
                <AlertIcon />
                {message}
              </Alert>
            )}
            <Button isLoading={isLoadingRegister} loadingText="Sign up" type="submit" colorScheme="teal" width="full">
              Sign up
            </Button>
          </VStack>
          <Text mt={4} textAlign="center">
            Already have an account ?{' '}
            <Link as={ReactRouterLink} color={textActiveColor} to="/login">
              Sign in{' '}
            </Link>{' '}
            now to share your great momment
          </Text>
        </FormStyled>
      ) : (
        <VerifyEmail
          email={formik.values.email}
          title="Verify your email"
          des="To continue using Penguin app, please verify your email address"
        />
      )}
    </AuthWrap>
  )
}

export default Register
