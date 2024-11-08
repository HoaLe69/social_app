import {
  Box,
  AlertIcon,
  Alert,
  FormControl,
  FormLabel,
  Button,
  Input,
  useColorModeValue,
  Heading,
  VStack,
  FormErrorMessage
} from '@chakra-ui/react'
import AuthWrap from './auth-wrap'
import { useFormik } from 'formik'
import styled from '@emotion/styled'
import * as Yup from 'yup'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { forgotHash } from '../../constant'
const FormStyle = styled.form`
  width: 400px;
`
const ResetPassWordFrom = () => {
  const navigate = useNavigate()
  const { username, hash } = useParams()
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const formik = useFormik({
    initialValues: {
      newpass: '',
      password: ''
    },
    onSubmit: async data => {
      if (forgotHash !== hash) {
        setMessage('Url is valid')
      }
      const baseUrl = process.env.REACT_APP_API_URL
      setLoading(true)
      try {
        axios.patch(`${baseUrl}/auth/reset-pass/${username}`, {
          password: data.password
        })
        navigate('/login')
        setLoading(false)
      } catch (err) {
        setMessage('user not found')
        setLoading(false)
      }
    },
    validationSchema: Yup.object({
      newpass: Yup.string()
        .required('Required')
        .min(6, 'Minimun 6 characters')
        .matches(/(?=.*\d)(?=.*[a-zA-Z]).*/, 'Include least one letter, one number'),
      password: Yup.string()
        .required('Required')
        .oneOf([Yup.ref('newpass')], 'Retype password not match')
    })
  })
  console.log(username, hash)
  return (
    <AuthWrap>
      <Box>
        <Heading mb={6}>Reset Your Password</Heading>

        <FormStyle onSubmit={formik.handleSubmit}>
          <VStack spacing="7" align="flex-start">
            <FormControl isInvalid={formik.errors.newpass}>
              <FormLabel htmlFor="newpass">New Password</FormLabel>
              <Input
                type="password"
                variant="filled"
                placeholder="Enter your new password..."
                name="newpass"
                id="newpass"
                _focus={{
                  backgroundColor: `${useColorModeValue('whiteAlpha.900', 'whiteAlpha.300')}`
                }}
                onChange={formik.handleChange}
                value={formik.values.newpass}
              />
              {formik.errors.newpass && <FormErrorMessage>{formik.errors.newpass}</FormErrorMessage>}
            </FormControl>
            <FormControl isInvalid={formik.errors.password}>
              <FormLabel htmlFor="password">Retype password</FormLabel>
              <Input
                type="password"
                variant="filled"
                placeholder="Retype your new password..."
                name="password"
                id="passwod"
                _focus={{
                  backgroundColor: `${useColorModeValue('whiteAlpha.900', 'whiteAlpha.300')}`
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
            <Button type="submit" isLoading={loading} loadingText="Reseting" colorScheme="teal" width="full">
              Reset password
            </Button>
          </VStack>
        </FormStyle>
      </Box>
    </AuthWrap>
  )
}

export default ResetPassWordFrom
