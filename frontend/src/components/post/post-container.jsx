import { Box, Button } from '@chakra-ui/react'
import { BeatLoader } from 'react-spinners'
import Post from './post'
import { getAllPost } from '@redux/api-request/posts'
import { useDispatch, useSelector } from 'react-redux'
import { memo, useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { createPostCleanOldState, deletePostCleanOldState, editPostCleanOldState } from '../../redux/postSlice'

const PostContainer = () => {
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(0)
  const dispatch = useDispatch()
  const { ref, inView } = useInView()

  const postDeletedId = useSelector(state => state.post.deletePost.id)
  const postEdited = useSelector(state => state.post.editPost.post)
  const postCreated = useSelector(state => state.post.createPost.post)

  const fetchPost = useCallback(async () => {
    if (loading || !hasMore) return
    try {
      setLoading(true)
      const response = await getAllPost(page)
      if (!response.length) {
        setHasMore(false)
        return
      }
      setPosts(pre => [...pre, ...response])
      setPage(pre => pre + 1)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [page, hasMore])

  useEffect(() => {
    if (inView) {
      fetchPost()
    }
  }, [inView])
  const handleRefreshPost = useCallback(() => {
    //todo
  }, [])

  useEffect(() => {
    if (!postDeletedId) return
    setPosts(pre => {
      const filter = pre.filter(post => post.id !== postDeletedId)
      return filter
    })
    return () => {
      if (postDeletedId) dispatch(deletePostCleanOldState())
    }
  }, [postDeletedId])

  useEffect(() => {
    if (!postEdited) return
    setPosts(pre => {
      const changed = pre.map(post => {
        if (post.id === postEdited.id) {
          return postEdited
        }
        return post
      })
      return changed
    })
    return () => {
      //todo
      if (postEdited) dispatch(editPostCleanOldState())
    }
  }, [postEdited])

  useEffect(() => {
    if (!postCreated) return
    setPosts(pre => [postCreated, ...pre])
    return () => {
      //todo
      if (postCreated) dispatch(createPostCleanOldState())
    }
  }, [postCreated])

  return (
    <Box pt={4}>
      {posts?.map(function (post) {
        return <Post key={post.id} {...post} />
      })}
      <Box pt={2} ref={ref} display="flex" justifyContent="center">
        {loading && <BeatLoader color="white" />}
      </Box>
      <Button onClick={handleRefreshPost}>Refresh</Button>
    </Box>
  )
}

export default memo(PostContainer)
