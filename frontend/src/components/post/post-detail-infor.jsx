import { Box } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import Post from './post-item'

const PostInfor = () => {
  const postInfor = useSelector(state => state.post?.currentPostInfor.post)
  return (
    <Box>
      <Post {...postInfor} isDetail />
    </Box>
  )
}

export default PostInfor
