import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailed,
  followOtherUserStart,
  followOtherUserFailed,
  getListUserFollowingStart,
  getListUserFollowingSuccess,
  getListUserFollowingFailed,
  getListUserFollowerStart,
  getListUserFollowerFailed,
  getListUserFollowerSuccess,
  getUserProfileStart,
  getUserProfileSuccess,
  getUserProfileFailure
} from '../userSlice'
import axios from 'axios'
import axiosClient from '../../config/axios'
import { verifyUserFailure, verifyUserSuccess } from '../authSlice'

const baseUrl = process.env.REACT_APP_API_URL

export const verifyUser = async dispatch => {
  try {
    const user = await axiosClient.get('/user/verify')
    dispatch(verifyUserSuccess(user))
    return user
  } catch (error) {
    console.log(error)
    dispatch(verifyUserFailure())
  }
}

// get user profile
export const getUserProfile = async (dispatch, userId) => {
  dispatch(getUserProfileStart())
  try {
    const res = await axiosClient.get(`/user/${userId}`)
    dispatch(getUserProfileSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(getUserProfileFailure())
  }
}

//update current user
export const updateUser = async (dispatch, updateInfo) => {
  dispatch(updateUserStart())
  try {
    const res = await axiosClient.patch(`/user/update/${updateInfo.id}`, updateInfo)
    dispatch(updateUserSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(updateUserFailed())
  }
}

//follow orther user
export const followOtherUser = async (dispatch, friendId, userLoginId) => {
  dispatch(followOtherUserStart())
  try {
    const res = await axiosClient.patch(`/user/interactive/${friendId}`, { id: userLoginId })
    dispatch(getUserProfileSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(followOtherUserFailed())
  }
}

// get list following

export const getListFollowing = async (dispatch, listIdUser) => {
  dispatch(getListUserFollowingStart())
  try {
    const res = await axiosClient.post(`${baseUrl}/user/getUserFollow`, { list: listIdUser })
    dispatch(getListUserFollowingSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(getListUserFollowingFailed())
  }
}

// get list follower
export const getListFollower = async (dispatch, listIdUser) => {
  dispatch(getListUserFollowerStart())
  try {
    const res = await axiosClient.post(`${baseUrl}/user/getUserFollow`, { list: listIdUser })
    dispatch(getListUserFollowerSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(getListUserFollowerFailed())
  }
}
