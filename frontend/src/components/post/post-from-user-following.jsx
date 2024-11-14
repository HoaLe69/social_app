import { Box } from '@chakra-ui/react'
import { BeatLoader } from 'react-spinners'
import Post from './post-item'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getAllPostFromUserFollowing } from '@redux/api-request/posts'

const PostFollowing = ({ index }) => {
  const dispatch = useDispatch()
  const posts = useSelector(state => state.post.allPostFromUser.posts)
  const isLoading = useSelector(state => state.post.allPostFromUser.isFetching)
  const userLogin = useSelector(state => state.auth.authState.user)

  useEffect(() => {
    if (userLogin?.following) getAllPostFromUserFollowing(dispatch, userLogin?.following)
  }, [userLogin?.following?.length, index])
  return (
    <Box pt={4}>
      {posts?.map(function (post) {
        return <Post key={post.id} {...post} />
      })}
      <Box pt={2} display="flex" justifyContent="center">
        {isLoading && <BeatLoader color="white" />}
      </Box>
    </Box>
  )
}

export default PostFollowing
