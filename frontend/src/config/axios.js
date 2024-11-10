import axios from 'axios'
import queryString from 'query-string'

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // headers: {
  //   // "Access-Control-Allow-Credentials": "true",
  //   // "Access-Control-Allow-Origin": "*",
  //   // "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, PUT, OPTIONS",
  //   // "Access-Control-Allow-Headers":
  //   //   "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
  //   Authorization: "Bearer " + accessToken,
  //   // Accept: "application/json",
  // },
  headers: {},

  withCredentials: true,
  paramsSerializer: params => queryString.stringify(params)
})

axiosClient.interceptors.response.use(
  response => {
    if (response && response.data) {
      return response.data
    }
    return response
  },
  error => {
    throw error
  }
)

export const axiosPublic = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  paramsSerializer: params => queryString.stringify(params)
})

axiosPublic.interceptors.response.use(
  response => {
    if (response && response.data) {
      return response.data
    }
    return response
  },
  error => {
    throw error
  }
)

export default axiosClient
