import { Box } from '@chakra-ui/react'
import { BeatLoader } from 'react-spinners'
import Post from './post'
import { getAllPost } from '@redux/api-request/posts'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import useInfinity from '../../hooks/useInfinityScroll'

const PostContainer = () => {
  const dispatch = useDispatch()
  const { page, lastPostRef, setHasmore } = useInfinity()
  const posts = useSelector(state => state.post.allPost.posts)
  const isLoading = useSelector(state => state.post.allPost.isFetching)
  const accessToken = JSON.parse(localStorage.getItem('user'))?.accessToken
  useEffect(() => {
    if (page < posts[posts.length - 1]?.page) return
    getAllPost(dispatch, accessToken, page, setHasmore)
  }, [page, accessToken, setHasmore, dispatch])
  return (
    <Box pt={4}>
      {posts?.map(function (post, index) {
        if (post.page >= 0) return null
        if (posts.length - 1 === index + 1) {
          return <Post key={post.id} ref={lastPostRef} {...post} />
        }
        return <Post key={post.id} {...post} />
      })}
      <Box pt={2} display="flex" justifyContent="center">
        {isLoading && <BeatLoader color="white" />}
      </Box>
    </Box>
  )
}

export default PostContainer
