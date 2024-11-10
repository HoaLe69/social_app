import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userProfile: {
      isFetching: false,
      info: null,
      error: false
    },
    updateUser: {
      isFetching: false,
      error: false
    },
    followOrtherUser: {
      isFetching: false,
      error: false,
      user: {}
    },
    getListUserFollowing: {
      isFetching: false,
      error: false,
      listFollowing: []
    },
    getListUserFollower: {
      isFetching: false,
      error: false,
      listFollower: []
    }
  },
  reducers: {
    getUserProfileStart: state => {
      state.userProfile.isFetching = true
      state.userProfile.error = false
    },
    getUserProfileSuccess: (state, action) => {
      state.userProfile.isFetching = false
      state.userProfile.info = action.payload
      state.userProfile.error = false
      state.followOrtherUser.isFetching = false
    },
    getUserProfileFailure: state => {
      state.userProfile.isFetching = false
      state.userProfile.error = true
    },
    updateUserStart: state => {
      state.updateUser.isFetching = true
    },
    updateUserSuccess: state => {
      state.updateUser.isFetching = false
      state.updateUser.error = false
    },
    updateUserFailed: state => {
      state.updateUser.isFetching = false
      state.updateUser.error = true
    },
    followOrtherUserStart: state => {
      state.followOrtherUser.isFetching = true
    },
    followOrtherUserSuccess: (state, action) => {
      state.followOrtherUser.isFetching = false
      state.followOrtherUser.error = false
      state.followOrtherUser.user = action.payload
    },
    followOrtherUserFailed: state => {
      state.followOrtherUser.isFetching = false
      state.followOrtherUser.error = true
    },
    getListUserFollowingStart: state => {
      state.getListUserFollowing.isFetching = true
    },
    getListUserFollowingSuccess: (state, action) => {
      state.getListUserFollowing.isFetching = false
      state.getListUserFollowing.listFollowing = action.payload
      state.getListUserFollowing.error = false
    },
    getListUserFollowingFailed: state => {
      state.getListUserFollowing.isFetching = false
      state.getListUserFollowing.error = true
    },
    getListUserFollowerStart: state => {
      state.getListUserFollower.isFetching = true
    },
    getListUserFollowerSuccess: (state, action) => {
      state.getListUserFollower.isFetching = false
      state.getListUserFollower.listFollower = action.payload
      state.getListUserFollower.error = false
    },
    getListUserFollowerFailed: state => {
      state.getListUserFollower.isFetching = false
      state.getListUserFollower.error = true
    }
  }
})

export const {
  getUserProfileStart,
  getUserProfileFailure,
  getUserProfileSuccess,
  updateUserFailed,
  updateUserStart,
  updateUserSuccess,
  followOrtherUserStart,
  followOrtherUserFailed,
  followOrtherUserSuccess,
  getListUserFollowingStart,
  getListUserFollowingSuccess,
  getListUserFollowingFailed,
  getListUserFollowerStart,
  getListUserFollowerFailed,
  getListUserFollowerSuccess
} = userSlice.actions

export default userSlice.reducer
