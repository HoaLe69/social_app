import { Avatar, Box, Heading, Text, Button, useColorModeValue, useDisclosure, HStack } from '@chakra-ui/react'
import EditProfileModal from '@components/modals/edit-profile'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { followOtherUser, getUserProfile } from '@redux/api-request/user'
import ListFollowingModal from '../modals/following'
import ListFollowerModal from '../modals/follower'
import MessaageButton from './message-button-profile'

const Details = ({ title, quantity, onClick, ...props }) => {
  return (
    <Box
      display="flex"
      flexDir="row"
      gap={1}
      alignItems="center"
      cursor="pointer"
      fontSize="16px"
      onClick={onClick}
      {...props}
    >
      <Text fontWeight="bold">{quantity}</Text>
      <Text>{title}</Text>
    </Box>
  )
}

const ProfileHeader = ({ userProfileId }) => {
  const dispatch = useDispatch()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const userProfile = useSelector(state => state.user.userProfile?.info)
  const isLoadingFollow = useSelector(state => state.user.followOtherUser.isFetching)
  const userLogin = useSelector(state => state.auth.authState.user)
  const quantityPost = useSelector(state => state.post.getPostUser?.posts).length

  useEffect(() => {
    getUserProfile(dispatch, userProfileId)
  }, [dispatch, userProfileId])

  const handleFollowOtherUser = async () => {
    followOtherUser(dispatch, userProfileId, userLogin?.id)
  }
  const relation = () => {
    const isInFollowingList = userProfile?.following.includes(userLogin?.id)
    const isInFollowerList = userProfile?.follower.includes(userLogin?.id)
    if (isInFollowingList && isInFollowerList) return 'Following'
    if (isInFollowerList && !isInFollowingList) return 'Following'
    if (!isInFollowerList && isInFollowingList) return 'Follow back'
    return 'Follow'
  }
  return (
    <Box pt={16}>
      <Box display="flex" alignItems="center" flexDir={{ base: 'column', lg: 'row' }} justifyContent="center">
        <Box width="300px" display="flex" justifyContent="center">
          <Avatar
            size="2xl"
            src={userProfile?.avatar}
            borderWidth="2px"
            borderStyle="solid"
            boxSize="150px"
            borderColor={useColorModeValue('gray.500', 'whiteAlpha.500')}
          />
        </Box>
        <Box display="flex" flexDir="column" alignItems="center">
          <HStack spacing={5}>
            <Heading as="h3" mt={2} fontSize="20px" fontWeight="500">
              {userProfile?.displayName}
            </Heading>
            {userLogin?.id === userProfileId ? (
              <Box mt={2} gap="10px" display="flex">
                <Button colorScheme="teal" onClick={onOpen}>
                  Edit profile
                </Button>
                <EditProfileModal isOpen={isOpen} user={userProfile} onClose={onClose} />
              </Box>
            ) : (
              <Box mt={2}>
                <Button px={4} onClick={handleFollowOtherUser} colorScheme="teal" isLoading={isLoadingFollow} mr={2}>
                  {relation()}
                </Button>
                <MessaageButton receiver={userProfile} member={[userLogin?.id, userProfile?.id]} />
              </Box>
            )}
          </HStack>
          <Box display="flex" gap="10px" mt={4} alignItems="center">
            <Details quantity={quantityPost} title="post" />
            <Follower follower={userProfile?.follower} />
            <Following following={userProfile?.following} />
          </Box>
          <Box p={2} fontSize="14px" color={useColorModeValue('blue.500', 'pink.400')}>
            {userProfile?.about}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const Following = ({ following }) => {
  const { isOpen: isOpenFollowing, onClose: onCloseFollowingModal, onOpen: onOpenFollowingModal } = useDisclosure()
  return (
    <Box>
      <Details quantity={following?.length} title="following" onClick={onOpenFollowingModal} />
      <ListFollowingModal isOpen={isOpenFollowing} onClose={onCloseFollowingModal} listsUserIdFollowing={following} />
    </Box>
  )
}

const Follower = ({ follower }) => {
  const { isOpen: isOpenFollower, onClose: onCloseFollowerModal, onOpen: onOpenFollowerModal } = useDisclosure()
  return (
    <Box>
      <Details quantity={follower?.length} title="follower" onClick={onOpenFollowerModal} />
      <ListFollowerModal isOpen={isOpenFollower} onClose={onCloseFollowerModal} listsUserIdFollower={follower} />
    </Box>
  )
}
export default ProfileHeader
