import { Box, Button, Heading, Text, Image, Flex } from '@chakra-ui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import images from '../assets'
import { hashBase64 } from '../constant'

const Verification = () => {
  const { username, hash } = useParams()
  const baseUrl = process.env.REACT_APP_API_URL
  const [err, setErr] = useState(false)
  useEffect(() => {
    if (hash !== hashBase64) return
    const activeAccount = async () => {
      try {
        await axios.get(`${baseUrl}/auth/active-account/${username}`)
      } catch (err) {
        console.log(err)
        setErr(true)
      }
    }
    activeAccount()
  }, [])
  return (
    <Box display="flex" alignItems="center" justifyContent="center" w="100vw" h="100vh">
      {err ? (
        <Box>Fail on load resource on server</Box>
      ) : (
        <Box textAlign="center">
          <Heading>Account Activated</Heading>
          <Flex justifyContent="center">
            <Image boxSize="200px" src={images.verified} alt="email verify successfully" />
          </Flex>
          <Text fontSize="20px">
            <strong>Hello , {username}</strong>
          </Text>
          <Text mt={2}>Thank you, your email has been verified. Your account is now active.</Text>
          <Text> Please click button bellow to login to your account</Text>
          <Button mt={6} colorScheme="teal">
            <a href="/login">LOGIN TO YOUR ACCOUNT</a>
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default Verification
