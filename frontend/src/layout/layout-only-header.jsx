import { Container, Box } from '@chakra-ui/react'
import NavTop from '@components/nav/nav-top'

const LayoutOnlyHeader = ({ children }) => {
  return (
    <Box>
      <NavTop />
      <Container maxW="container.lg">{children}</Container>
      asdjklhajksd
    </Box>
  )
}

export default LayoutOnlyHeader
