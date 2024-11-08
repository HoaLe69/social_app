import axiosClient from '@config/axios'
import {
  createRoomConversationSuccess,
  createRoomConversationFailed,
  createRoomConversationStart,
  getAllRoomConversationStart,
  getAllRoomConversationSuccess,
  getAllRoomConversationFailed
} from '../conversationSlice'
import axios from 'axios'

const baseUrl = process.env.REACT_APP_API_URL

//create room chat
export const createRoomChat = async (dispatch, member) => {
  dispatch(createRoomConversationStart())
  try {
    const res = axiosClient.post(`${baseUrl}/conversation/create`, {
      member: member
    })
    dispatch(createRoomConversationSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(createRoomConversationFailed())
  }
}

//get all room chat
export const getAllRoomConversation = async (dispatch, accessToken, id) => {
  dispatch(getAllRoomConversationStart())
  try {
    const res = await axios.get(`${baseUrl}/conversation/all/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    dispatch(getAllRoomConversationSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(getAllRoomConversationFailed())
  }
}

// update lastMessage
export const updateLastestMess = async (id, lastestMessage, accessToken) => {
  try {
    await axios.patch(
      `${baseUrl}/conversation/update/lastestMessage/${id}`,
      { lastestMessage: lastestMessage },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
  } catch (err) {
    console.log(err)
  }
}
