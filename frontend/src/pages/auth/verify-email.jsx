import { Box, Heading, Image, Text } from '@chakra-ui/react'
import images from '../../assets'

const VerifyEmail = ({ email, title, des }) => {
  return (
    <Box display="flex" flexDir="column" gap="30px" alignItems="center">
      <Image src={images.email} alt="email verification" boxSize="100px" rounded="full" objectFit="cover" />
      <Heading>{title}</Heading>
      <Text textAlign="center">{des}</Text>
      <Text>
        <strong>{email}</strong>
      </Text>
    </Box>
  )
}

export default VerifyEmail
