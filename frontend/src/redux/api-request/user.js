import {
  getUserFailed,
  getUserSuccess,
  getUserStart,
  updateUserStart,
  updateUserSuccess,
  updateUserFailed,
  followOrtherUserStart,
  followOrtherUserFailed,
  getListUserFollowingStart,
  getListUserFollowingSuccess,
  getListUserFollowingFailed,
  getListUserFollowerStart,
  getListUserFollowerFailed,
  getListUserFollowerSuccess
} from '../userSlice'
import axios from 'axios'

const baseUrl = process.env.REACT_APP_API_URL

//get current user
export const getUser = async (dispatch, id, accessToken) => {
  dispatch(getUserStart())
  try {
    const res = await axios.get(`${baseUrl}/user/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    dispatch(getUserSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(getUserFailed())
  }
}

//update current user
export const updateUser = async (dispatch, id, userInforUpdate, accessToken) => {
  dispatch(updateUserStart())
  try {
    await axios.patch(`${baseUrl}/user/update/${id}`, userInforUpdate, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    dispatch(updateUserSuccess())
  } catch (err) {
    console.log(err)
    dispatch(updateUserFailed())
  }
}

//follow orther user
export const followOrtherUser = async (dispatch, friendId, yourId, accessToken, relation, userLogin) => {
  dispatch(followOrtherUserStart())
  try {
    const res = await axios.patch(`${baseUrl}/user/interactive/${friendId}`, yourId, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    const relationship = relation()
    if (relationship === 'Following')
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...userLogin,
          following: userLogin?.following.filter(id => id !== friendId)
        })
      )
    else {
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...userLogin,
          following: [...userLogin?.following, friendId]
        })
      )
    }
    dispatch(getUserSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(followOrtherUserFailed())
  }
}

// get list following

export const getListFollowing = async (dispatch, listIdUser, accessToken) => {
  dispatch(getListUserFollowingStart())
  try {
    const res = await axios.post(
      `${baseUrl}/user/getUserFollow`,
      { list: listIdUser },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
    dispatch(getListUserFollowingSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(getListUserFollowingFailed())
  }
}

// get list follower
export const getListFollower = async (dispatch, listIdUser, accessToken) => {
  dispatch(getListUserFollowerStart())
  try {
    const res = await axios.post(
      `${baseUrl}/user/getUserFollow`,
      { list: listIdUser },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
    dispatch(getListUserFollowerSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(getListUserFollowerFailed())
  }
}
