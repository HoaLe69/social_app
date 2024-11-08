import { loginStart, loginFailed, loginSuccess, registerStart, registerSuccess, registerFailed } from '../authSlice'
import route from '@config/route'
import { config } from './configAxiosHeader'
import axios from 'axios'

const baseUrl = process.env.REACT_APP_API_URL

export const login = async (dispatch, navigate, formData) => {
  dispatch(loginStart())
  try {
    const res = await axios.post(`${baseUrl}/auth/login`, formData)
    dispatch(loginSuccess(res))
    localStorage.setItem('user', JSON.stringify(res))
    window.dispatchEvent(new Event('storage'))
    navigate(route.home)
  } catch (err) {
    console.log(err)
    dispatch(loginFailed(err.response.data.message || 'Mật khẩu không đúng'))
  }
}
// register account
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
