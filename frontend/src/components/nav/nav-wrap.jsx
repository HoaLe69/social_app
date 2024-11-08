import { Box, Container, useColorModeValue } from '@chakra-ui/react'
import { COLOR_THEME } from '../../constant'

const NavWrap = ({ children, isFixed, ...props }) => {
  return (
    <Box
      as="nav"
      zIndex={1}
      position={isFixed ? 'relative' : 'fixed'}
      borderBottomWidth={isFixed && 1}
      borderColor={COLOR_THEME.BORDER}
      css={{ backdropFilter: 'blur(10px)' }}
      bg={useColorModeValue('#ffffff40', '#20202380')}
      w="full"
      {...props}
    >
      <Container maxW={'container.lg'} p={2}>
        {children}
      </Container>
    </Box>
  )
}
export default NavWrap
