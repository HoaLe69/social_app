import WrapContent from '@components/common/wrap-content'
import { Text, Avatar, Button, Flex, useColorModeValue } from '@chakra-ui/react'

const NotifyItem = ({ photoUrl, displayName }) => {
  return (
    <Flex
      align="center"
      gap="10px"
      _hover={{
        backgroundColor: `${useColorModeValue('blackAlpha.200', 'whiteAlpha.300')}`
      }}
      p={2}
      cursor="pointer"
      rounded="10px"
    >
      <Avatar src={photoUrl} alt={displayName} />
      <Text flex={1}>
        <strong>{displayName} </strong>started follow you on Peguin hub
      </Text>
      <Button colorScheme="teal">Follow back</Button>
    </Flex>
  )
}

const Notify = () => {
  const notifyDt = []
  return (
    <WrapContent title="Notification">
      {notifyDt.map((dt, index) => {
        return <NotifyItem photoUrl={dt.photoUrl} displayName={dt.displayName} key={index} />
      })}
    </WrapContent>
  )
}

export default Notify
