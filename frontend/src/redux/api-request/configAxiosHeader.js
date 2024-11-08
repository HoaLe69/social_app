const AccessToken = () => {
  return JSON.parse(localStorage.getItem('user'))?.accessToken
}

export const config = {
  headers: {
    Authorization: 'Bearer ' + AccessToken()
  }
}
