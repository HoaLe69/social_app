import { createSlice } from '@reduxjs/toolkit'

export const postSlice = createSlice({
  name: 'posts',
  initialState: {
    currentPostInfor: {
      post: {}
    },
    createPost: {
      isFetching: false,
      error: false,
      success: false,
      post: null
    },
    deletePost: {
      isFetching: false,
      success: false,
      error: false,
      id: null
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
      success: false,
      post: null
    }
  },
  reducers: {
    resetStatus: state => {
      state.createPost.success = false
      state.editPost.success = false
    },
    editPostCleanOldState: state => {
      state.editPost.post = null
    },
    editPostStart: state => {
      state.editPost.isFetching = true
    },
    editPostSuccess: (state, action) => {
      state.editPost.error = false
      state.editPost.isFetching = false
      state.editPost.success = true
      state.editPost.post = action.payload
    },
    editPostFailed: state => {
      state.editPost.error = true
      state.editPost.success = false
      state.editPost.isFetching = false
    },
    getCurrentPostInfor: (state, action) => {
      state.currentPostInfor.post = action.payload
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
      state.createPost.success = true
      state.createPost.post = action.payload
    },
    createPostFailed: state => {
      state.createPost.error = true
      state.createPost.isFetching = false
    },
    createPostCleanOldState: state => {
      state.createPost.post = null
    },
    deletePostStart: state => {
      state.deletePost.isFetching = true
    },
    deletePostSuccess: (state, action) => {
      state.deletePost.isFetching = false
      state.deletePost.error = false
      state.deletePost.id = action.payload
    },
    deletePostFailed: state => {
      state.deletePost.error = true
      state.deletePost.isFetching = false
    },
    deletePostCleanOldState: state => {
      state.deletePost.id = null
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
  editPostCleanOldState,
  getAllPostUserStart,
  getAllPostUserFailed,
  getAllPostUserSuccess,
  getCurrentPostInfor,
  createPostStart,
  createPostSuccess,
  createPostFailed,
  createPostCleanOldState,
  deletePostStart,
  deletePostFailed,
  deletePostSuccess,
  deletePostCleanOldState,
  getPostUserStart,
  getPostUserFalied,
  getPostUserSuccess,
  getPostByIdStart,
  getPostByIdFailed,
  getPostByIdSuccess
} = postSlice.actions
export default postSlice.reducer
