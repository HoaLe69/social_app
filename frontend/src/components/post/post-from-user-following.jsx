import { Box } from '@chakra-ui/react'
import { BeatLoader } from 'react-spinners'
import Post from './post'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getAllPostFromUserFollowing } from '@redux/api-request/posts'

const PostFollowing = ({ index }) => {
  const dispatch = useDispatch()
  const posts = useSelector(state => state.post.allPostFromUser.posts)
  const isLoading = useSelector(state => state.post.allPostFromUser.isFetching)
  const userLogin = JSON.parse(localStorage.getItem('user'))
  useEffect(() => {
    getAllPostFromUserFollowing(dispatch, userLogin?.following, userLogin?.accessToken)
  }, [userLogin?.accessToken, dispatch, userLogin?.following?.length, index])
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
