import axios from 'axios'
import { getAllCommentFailed, getAllCommentStart, getAllCommentSuccess } from '../commentSlice'

const baseUrl = process.env.REACT_APP_API_URL

// get all comment
export const getAllComment = async (dispatch, postId, accessToken) => {
  dispatch(getAllCommentStart())
  try {
    const res = await axios.get(`${baseUrl}/comment/${postId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    dispatch(getAllCommentSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(getAllCommentFailed())
  }
}
