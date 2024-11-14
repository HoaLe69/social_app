import { Box, Link, Heading, Image, Grid, GridItem, useDisclosure } from '@chakra-ui/react'
import { AiFillHeart } from 'react-icons/ai'
import { getAllPostUser } from '@redux/api-request/posts'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getCurrentPostInfor } from '@redux/postSlice'
import FeedModal from '../modals/feed'

const ProfilePostItem = ({
  userId,
  description,
  comments,
  displayName,
  cloudinaryId,
  tag,
  photoUrl,
  thumbnail,
  like,
  id,
  createAt,
  isDetail
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const dispatch = useDispatch()
  const handleShowFullPost = () => {
    dispatch(
      getCurrentPostInfor({
        id,
        userId,
        cloudId: cloudinaryId,
        photoUrl,
        tag,
        displayName,
        description,
        thumbnail,
        like,
        comments,
        createAt,
        isDetail
      })
    )
    onOpen()
  }
  return (
    <Box position="relative" role="group" cursor="pointer" onClick={handleShowFullPost}>
      <Box height={{ base: '300px', lg: '400px' }}>
        <Image src={thumbnail} alt={id} height="full" width="full" objectFit="cover" />
      </Box>
      <Box
        position="absolute"
        top={0}
        right={0}
        left={0}
        bottom={0}
        display="none"
        bg={'blackAlpha.500'}
        _groupHover={{ display: 'grid' }}
        placeItems="center"
      >
        <Box display="flex" alignItems="center" gap="5px" color="whiteAlpha.800">
          {like?.length} <AiFillHeart />
        </Box>
        <FeedModal isOpen={isOpen} onClose={onClose} />
      </Box>
    </Box>
  )
}

const ProfilePost = ({ userProfileId }) => {
  const dispatch = useDispatch()
  const profilePost = useSelector(state => state.post.getPostUser.posts)

  useEffect(() => {
    getAllPostUser(dispatch, userProfileId)
  }, [userProfileId, dispatch])

  return (
    <Box pt={5}>
      <Heading
        textAlign="center"
        fontSize={'md'}
        textUnderlineOffset={4}
        textDecoration="underline"
        textDecorationThickness={4}
        textDecorationColor="gray.500"
      >
        All post
      </Heading>
      <Grid
        templateColumns={{
          base: 'repeat(2, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3 , 1fr)',
          lg: 'repeat(3 , 1fr) '
        }}
        gap={2}
        pt={4}
      >
        {profilePost.map(data => {
          return (
            <GridItem key={data.id}>
              <ProfilePostItem {...data} />
            </GridItem>
          )
        })}
      </Grid>
    </Box>
  )
}

export default ProfilePost
