import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    login: {
      currentUser: null,
      isFetching: false,
      success: false,
      error: false,
      message: null
    },
    register: {
      isFetching: false,
      success: false,
      error: false,
      message: null
    }
  },
  reducers: {
    loginStart: state => {
      state.login.isFetching = true
      state.login.message = null
    },
    loginSuccess: (state, action) => {
      state.login.currentUser = action.payload
      state.login.isFetching = false
      state.login.error = false
      state.login.success = true
      state.login.message = null
    },
    loginFailed: (state, action) => {
      state.login.error = true
      state.login.isFetching = false
      state.login.message = action.payload
    },
    registerStart: state => {
      state.register.isFetching = true
    },
    registerSuccess: state => {
      state.register.isFetching = false
      state.register.success = true
    },
    registerFailed: (state, action) => {
      state.register.error = true
      state.register.isFetching = false
      state.register.message = action.payload
    }
  }
})

export const { loginStart, loginSuccess, loginFailed, registerStart, registerFailed, registerSuccess } =
  authSlice.actions

export default authSlice.reducer
