import { createSlice } from '@reduxjs/toolkit'

const commentSlice = createSlice({
  name: 'comment',
  initialState: {
    allComment: {
      isFetching: false,
      error: false,
      comment: []
    }
  },
  reducers: {
    getAllCommentStart: state => {
      state.allComment.isFetching = true
    },
    getAllCommentSuccess: (state, action) => {
      state.allComment.isFetching = false
      state.allComment.comment = action.payload
      state.allComment.error = false
    },
    getAllCommentFailed: state => {
      state.allComment.isFetching = false
      state.allComment.error = true
    }
  }
})

export const { getAllCommentStart, getAllCommentSuccess, getAllCommentFailed } = commentSlice.actions
export default commentSlice.reducer
