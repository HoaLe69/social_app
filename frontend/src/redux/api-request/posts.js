import {
  createPostStart,
  createPostSuccess,
  createPostFailed,
  deletePostSuccess,
  deletePostFailed,
  deletePostStart,
  getPostUserStart,
  getPostUserSuccess,
  getPostUserFalied,
  getPostByIdStart,
  getPostByIdFailed,
  getPostByIdSuccess,
  getAllPostUserStart,
  getAllPostUserSuccess,
  getAllPostUserFailed,
  editPostStart,
  editPostSuccess,
  editPostFailed
} from '../postSlice'
import axiosClient from '../../config/axios'

const baseUrl = process.env.REACT_APP_API_URL

//create post
export const createPost = async (dispatch, navigate, formData) => {
  dispatch(createPostStart())
  try {
    const res = await axiosClient.post(`/post/upload`, formData)
    dispatch(createPostSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(createPostFailed())
  }
}

// edit post
export const editPost = async (dispatch, formData, postId, cloudId) => {
  dispatch(editPostStart())
  try {
    const res = await axiosClient.patch(`/post/edit/${postId}/${cloudId}`, formData)
    dispatch(editPostSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(editPostFailed())
  }
}
//get all post
export const getAllPost = async page => {
  try {
    const res = await axiosClient.get(`/post/all-post?page=${page}`)
    return res.content
  } catch (err) {
    console.log(err)
  }
}

//deletePost
export const deletePost = async (dispatch, id, cloudId) => {
  dispatch(deletePostStart())
  try {
    await axiosClient.delete(`/post/delete/${id}/${cloudId}`)
    dispatch(deletePostSuccess(id))
  } catch (err) {
    dispatch(deletePostFailed())
  }
}

// get all post of user
export const getAllPostUser = async (dispatch, id) => {
  dispatch(getPostUserStart())
  try {
    const res = await axiosClient.get(`${baseUrl}/post/all-post-user/${id}`)
    dispatch(getPostUserSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(getPostUserFalied())
  }
}

// get  post by id
export const getPostById = async (dispatch, id) => {
  dispatch(getPostByIdStart())
  try {
    const res = await axiosClient.get(`/post/${id}`)
    dispatch(getPostByIdSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(getPostByIdFailed())
  }
}

// react post
export const reactPost = async (postId, userId) => {
  const res = axiosClient.patch(`/post/react/${postId}/${userId}`)
  return res
}

// get all post from userFollowing
// get list following

export const getAllPostFromUserFollowing = async (dispatch, listIdUser) => {
  dispatch(getAllPostUserStart())
  try {
    const res = await axiosClient.post(`${baseUrl}/post/all-post-user-following`, { list: listIdUser })
    dispatch(getAllPostUserSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(getAllPostUserFailed())
  }
}
