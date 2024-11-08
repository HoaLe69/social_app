import LayoutNotHeader from '@layout/layout-not-header'
import { Box } from '@chakra-ui/react'
import PostInfor from '@components/post/post-detail-infor'
import Comment from '@components/post/comment'

const DetailPost = () => {
  return (
    <LayoutNotHeader>
      <Box>
        <PostInfor />
        <Comment />
      </Box>
    </LayoutNotHeader>
  )
}

export default DetailPost
