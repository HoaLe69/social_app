import { Box, Flex, Text } from '@chakra-ui/react'
import LayoutFull from '../layout/layout-full'

const PageNotFound = () => {
  return (
    <LayoutFull>
      {' '}
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Flex gap={2} alignItems="center">
          <Text fontSize="4xl">404</Text>
          Not Found Page
        </Flex>
      </Box>
    </LayoutFull>
  )
}
export default PageNotFound
