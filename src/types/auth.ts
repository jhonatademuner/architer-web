export interface UserRegisterDTO {
  name: string
  email: string
  password: string
}

export interface UserLoginDTO {
  email: string
  password: string
}

export interface RefreshTokenRequestDTO {
  refreshToken: string
}

export interface JwtTokenDTO {
  accessToken: string
  refreshToken: string
}
