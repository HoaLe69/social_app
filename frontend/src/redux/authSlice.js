import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authState: {
      user: null,
      isAuthenticated: null
    },
    loginState: {
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
    verifyUserSuccess: (state, action) => {
      state.authState.user = action.payload
      state.authState.isAuthenticated = true
    },
    verifyUserFailure: state => {
      state.authState.user = null
      state.authState.isAuthenticated = false
    },
    loginStart: state => {
      state.loginState.isFetching = true
      state.loginState.message = null
    },
    loginSuccess: state => {
      state.loginState.isFetching = false
      state.loginState.error = false
      state.loginState.success = true
      state.loginState.message = null
    },
    loginFailed: (state, action) => {
      state.loginState.error = true
      state.loginState.isFetching = false
      state.loginState.message = action.payload
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

export const {
  loginStart,
  loginSuccess,
  loginFailed,
  registerStart,
  registerFailed,
  registerSuccess,
  verifyUserSuccess,
  verifyUserFailure
} = authSlice.actions

export default authSlice.reducer
