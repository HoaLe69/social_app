import { Box } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import Post from './post'

const PostInfor = () => {
  const postInfor = useSelector(state => state.post?.currentPostInfor.post)
  // useEffect(() => {
  //   if (accessToken) {
  //     getPostById(dispatch, idPost, accessToken);
  //   }
  // }, [accessToken, dispatch, idPost]);
  return (
    <Box>
      <Post {...postInfor} isDetail />
    </Box>
  )
}

export default PostInfor
