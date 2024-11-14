import { Link } from 'react-router-dom'
import { Text, useColorModeValue } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { AiOutlineQq } from 'react-icons/ai'

const LogoBox = styled.span`
  font-weight: bold;
  font-size: 20px;
  display: inline-flex;
  align-items: center;
  padding: 10px 0;
  line-height: 20px;
`

const Logo = ({ onClick }) => {
  return (
    <Link to={'/'}>
      <LogoBox onClick={onClick}>
        <AiOutlineQq />
        <Text
          color={useColorModeValue('gray.800', 'whiteAlpha.900')}
          fontWeight={'bold'}
          ml={1}
          fontFamily={`'M PLUS Rounded 1c' , san-serif`}
        >
          Penguin Hup
        </Text>
      </LogoBox>
    </Link>
  )
}
export default Logo
