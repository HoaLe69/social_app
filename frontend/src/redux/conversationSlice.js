import { createSlice } from '@reduxjs/toolkit'

const conversationSlice = createSlice({
  name: 'roomConversation',
  initialState: {
    selectedRoom: {
      info: null,
      receiver: null
    },
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
      rooms: []
    }
  },
  reducers: {
    getCurrentSelectedRoom: (state, action) => {
      state.selectedRoom.info = action.payload.info
      state.selectedRoom.receiver = action.payload.receiver
    },
    chooseRoomFloat: (state, action) => {
      console.log({ payload: action.payload })
      const isOpened = state.roomFloatSelect.rooms.some(room => {
        return room?.info.id === action.payload.info.id
      })
      const currentOpenRoom = state.roomFloatSelect.rooms.length >= 3
      if (currentOpenRoom && !isOpened) {
        state.roomFloatSelect.rooms = [...state.roomFloatSelect.rooms.slice(1), { ...action.payload }]
      } else {
        if (isOpened) state.roomFloatSelect.rooms = [...state.roomFloatSelect.rooms]
        else state.roomFloatSelect.rooms = [action.payload, ...state.roomFloatSelect.rooms]
      }
    },
    closeRoomFloat: (state, action) => {
      state.roomFloatSelect.rooms = state.roomFloatSelect.rooms.filter(room => {
        return room.info.id !== action.payload
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
  getAllRoomConversationSuccess,
  getCurrentSelectedRoom
} = conversationSlice.actions

export default conversationSlice.reducer
