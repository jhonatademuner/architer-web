import api from '@/lib/axios'
import Cookies from 'js-cookie'
import type { UserRegisterDTO, UserLoginDTO, JwtTokenDTO, RefreshTokenRequestDTO } from '@/types/auth'

// Auth methods
export const auth = {
  async register(data: UserRegisterDTO): Promise<void> {
    await api.post('/v1/auth/register', data)
  },

  async login(data: UserLoginDTO): Promise<JwtTokenDTO> {
    const response = await api.post<JwtTokenDTO>('/v1/auth/login', data)
    const tokens = response.data

    Cookies.set('access_token', tokens.accessToken, {
      expires: 1, // 1 day
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    })

    Cookies.set('refresh_token', tokens.refreshToken, {
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    })

    return tokens
  },

  async logout(): Promise<void> {
    const token = Cookies.get('access_token')
    if (token) {
      try{
        await api.post('/v1/auth/logout', null, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }

    Cookies.remove('access_token')
    Cookies.remove('refresh_token')
  },

  async refresh(): Promise<JwtTokenDTO> {
    const refreshToken = Cookies.get('refresh_token')
    const accessToken = Cookies.get('access_token')

    if (!refreshToken || !accessToken) {
      throw new Error('No tokens available for refresh')
    }

    const body: RefreshTokenRequestDTO = { refreshToken }
    const response = await api.post<JwtTokenDTO>(
      '/v1/auth/refresh',
      body,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )

    const newTokens = response.data

    Cookies.set('access_token', newTokens.accessToken, {
      expires: 1,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    })

    Cookies.set('refresh_token', newTokens.refreshToken, {
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    })

    return newTokens
  },
}