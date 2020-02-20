import axios from 'axios'

const instance = axios.create({
  baseURL: '/'
})

instance.interceptors.response.use(response => {
  return response.data
})

export default instance
