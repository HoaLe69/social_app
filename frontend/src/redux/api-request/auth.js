import { loginStart, loginFailed, loginSuccess, registerStart, registerSuccess, registerFailed } from '../authSlice'
import route from '@config/route'
import { config } from './configAxiosHeader'
import axios from 'axios'
import axiosClient, { axiosPublic } from '../../config/axios'

const baseUrl = process.env.REACT_APP_API_URL

export const login = async (dispatch, navigate, formData) => {
  dispatch(loginStart())
  try {
    await axiosPublic.post(`/auth/login`, formData)
    dispatch(loginSuccess())
    navigate(route.home)
  } catch (err) {
    console.log(err)
    dispatch(loginFailed(err.response.data.message || 'Mật khẩu không đúng'))
  }
}
export const getUserProfileFromGoogle = async token => {
  const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json`, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
  return res.data
}
export const authWithSocial = async formData => {
  const res = await axiosClient.post('/auth/loginWithSocial', formData)
  return res
}
//register account
export const register = async (dispatch, navigate, formData) => {
  dispatch(registerStart())
  try {
    await axios.post(`${baseUrl}/auth/register`, formData, config)
    dispatch(registerSuccess())
  } catch (err) {
    console.log(err)
    dispatch(registerFailed(err.response.data.message))
  }
}
