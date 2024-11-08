import { createSlice } from '@reduxjs/toolkit'

export const postSlice = createSlice({
  name: 'posts',
  initialState: {
    currentPostInfor: {
      post: {}
    },
    allPost: {
      isFetching: false,
      error: false,
      posts: []
    },
    createPost: {
      isFetching: false,
      error: false,
      success: false
    },
    deletePost: {
      isFetching: false,
      success: false,
      error: false
    },
    getPostUser: {
      isFetching: false,
      error: false,
      posts: []
    },
    getPostById: {
      isFetching: false,
      error: false,
      post: {}
    },
    allPostFromUser: {
      isFetching: false,
      error: false,
      posts: []
    },
    editPost: {
      isFetching: false,
      error: false,
      success: false
    }
  },
  reducers: {
    resetStatus: state => {
      state.createPost.success = false
      state.editPost.success = false
    },
    editPostStart: state => {
      state.editPost.isFetching = true
    },
    editPostSuccess: (state, action) => {
      state.editPost.error = false
      state.editPost.isFetching = false
      state.editPost.success = true
      const index = state.allPost.posts.findIndex(post => post.id === action.payload.id)

      const newList = [...state.allPost.posts.splice(index, 1, action.payload)]
    },
    editPostFailed: state => {
      state.editPost.error = true
      state.editPost.success = false
      state.editPost.isFetching = false
    },
    getCurrentPostInfor: (state, action) => {
      state.currentPostInfor.post = action.payload
    },
    getAllPostStart: state => {
      state.allPost.isFetching = true
    },
    getAllPostSuccess: (state, action) => {
      state.allPost.isFetching = false
      state.allPost.error = false
      state.allPost.posts = [
        ...new Set([...state.allPost.posts, ...action.payload.content, { page: action.payload.number }])
      ]
    },
    getAllPostFailed: state => {
      state.allPost.error = true
      state.allPost.isFetching = false
    },
    getAllPostUserStart: state => {
      state.allPostFromUser.isFetching = true
    },
    getAllPostUserSuccess: (state, action) => {
      state.allPostFromUser.isFetching = false
      state.allPostFromUser.error = false
      state.allPostFromUser.posts = [...action.payload]
    },
    getAllPostUserFailed: state => {
      state.allPostFromUser.error = true
      state.allPostFromUser.isFetching = false
    },
    createPostStart: state => {
      state.createPost.isFetching = true
    },
    createPostSuccess: (state, action) => {
      state.createPost.isFetching = false
      state.allPost.posts = [action.payload, ...state.allPost.posts]
      state.createPost.success = true
    },
    createPostFailed: state => {
      state.createPost.error = true
      state.createPost.isFetching = false
    },
    deletePostStart: state => {
      state.deletePost.isFetching = true
    },
    deletePostSuccess: (state, action) => {
      state.deletePost.isFetching = false
      state.deletePost.error = false
      state.allPost.posts = [...state.allPost.posts.filter(post => post.id !== action.payload)]
    },
    deletePostFailed: state => {
      state.deletePost.error = true
      state.deletePost.isFetching = false
    },
    getPostUserStart: state => {
      state.getPostUser.isFetching = true
    },
    getPostUserSuccess: (state, action) => {
      state.getPostUser.isFetching = false
      state.getPostUser.posts = action.payload
      state.getPostUser.error = false
    },
    getPostUserFalied: state => {
      state.getPostUser.isFetching = false
      state.getPostUser.error = true
    },
    getPostByIdStart: state => {
      state.getPostById.isFetching = true
    },
    getPostByIdSuccess: (state, action) => {
      state.getPostById.isFetching = false
      state.getPostById.post = action.payload
      state.getPostById.error = false
    },
    getPostByIdFailed: state => {
      state.getPostById.isFetching = false
      state.getPostById.error = true
    }
  }
})

export const {
  resetStatus,
  editPostStart,
  editPostFailed,
  editPostSuccess,
  getAllPostUserStart,
  getAllPostUserFailed,
  getAllPostUserSuccess,
  getCurrentPostInfor,
  getAllPostStart,
  getAllPostFailed,
  getAllPostSuccess,
  createPostStart,
  createPostSuccess,
  createPostFailed,
  deletePostStart,
  deletePostFailed,
  deletePostSuccess,
  getPostUserStart,
  getPostUserFalied,
  getPostUserSuccess,
  getPostByIdStart,
  getPostByIdFailed,
  getPostByIdSuccess
} = postSlice.actions
export default postSlice.reducer
