import axios from 'axios'
import Cookies from 'js-cookie'
import { auth } from '@/lib/auth'
import Router from 'next/router'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
  withCredentials: true,
})

// Attach access token from cookie (non-HttpOnly)
api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let refreshPromise: Promise<string> | null = null
const failedQueue: Array<(token: string) => void> = []

function queueRequest(callback: (token: string) => void) {
  failedQueue.push(callback)
}

function resolveQueue(newToken: string) {
  failedQueue.forEach((cb) => cb(newToken))
  failedQueue.length = 0
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    const is401 = error.response?.status === 401
    const isRefreshEndpoint = originalRequest.url?.includes('/auth/refresh')
    const hasRetried = originalRequest._retry

    if (is401 && !isRefreshEndpoint && !hasRetried) {
      originalRequest._retry = true

      if (!isRefreshing) {
        isRefreshing = true
        refreshPromise = auth.refresh()
          .then(({ accessToken }) => {
            Cookies.set('access_token', accessToken)
            resolveQueue(accessToken)
            return accessToken
          })
          .catch((err) => {
            Cookies.remove('access_token')
            Cookies.remove('refresh_token')
            Router.push('/login')
            throw err
          })
          .finally(() => {
            isRefreshing = false
            refreshPromise = null
          })
      }

      return new Promise((resolve, reject) => {
        queueRequest((newToken: string) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          resolve(api(originalRequest))
        })
      })
    }

    return Promise.reject(error)
  }
)

export default api
