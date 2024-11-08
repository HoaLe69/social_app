import { createSlice } from '@reduxjs/toolkit'

const conversationSlice = createSlice({
  name: 'roomConversation',
  initialState: {
    getLastestMessage: {
      lastestMessage: undefined,
      roomId: undefined
    },
    selectedRoom: {
      id: undefined,
      recevierId: undefined
    },
    createRoomConversation: {
      isFetching: false,
      error: false,
      room: {}
    },
    getAllRoomConversation: {
      isFetching: false,
      error: false,
      rooms: []
    },
    roomFloatSelect: {
      Listreceiver: []
    }
  },
  reducers: {
    chooseRoomFloat: (state, action) => {
      const isOpened = state.roomFloatSelect.Listreceiver.some(room => {
        return room?.roomId === action.payload.roomId
      })
      const quantityRoom = state.roomFloatSelect.Listreceiver.length >= 3
      if (quantityRoom && !isOpened) {
        state.roomFloatSelect.Listreceiver = [...state.roomFloatSelect.Listreceiver.slice(1), { ...action.payload }]
      } else {
        if (isOpened) state.roomFloatSelect.Listreceiver = [...state.roomFloatSelect.Listreceiver]
        else state.roomFloatSelect.Listreceiver = [{ ...action.payload }, ...state.roomFloatSelect.Listreceiver]
      }
    },
    closeRoomFloat: (state, action) => {
      state.roomFloatSelect.Listreceiver = state.roomFloatSelect.Listreceiver.filter(room => {
        return room.roomId !== action.payload
      })
    },
    getLastestMessage: (state, action) => {
      state.getLastestMessage.lastestMessage = action.payload.mess
      state.getLastestMessage.roomId = action.payload.id
    },
    getSelectedRoom: (state, action) => {
      state.selectedRoom.id = action.payload
    },
    createRoomConversationStart: state => {
      state.createRoomConversation.isFetching = true
    },
    createRoomConversationSuccess: (state, action) => {
      state.createRoomConversation.isFetching = false
      state.createRoomConversation.room = action.payload
      state.createRoomConversation.error = false
    },
    createRoomConversationFailed: state => {
      state.createRoomConversation.isFetching = false
      state.createRoomConversation.error = true
    },
    getAllRoomConversationStart: state => {
      state.getAllRoomConversation.isFetching = true
    },

    getAllRoomConversationSuccess: (state, action) => {
      state.getAllRoomConversation.isFetching = false
      state.getAllRoomConversation.rooms = action.payload
      state.getAllRoomConversation.error = false
    },
    getAllRoomConversationFailed: state => {
      state.getAllRoomConversation.isFetching = false
      state.getAllRoomConversation.error = true
    }
  }
})

export const {
  closeRoomFloat,
  chooseRoomFloat,
  getSelectedRoom,
  getLastestMessage,
  createRoomConversationStart,
  createRoomConversationFailed,
  createRoomConversationSuccess,
  getAllRoomConversationStart,
  getAllRoomConversationFailed,
  getAllRoomConversationSuccess
} = conversationSlice.actions

export default conversationSlice.reducer
