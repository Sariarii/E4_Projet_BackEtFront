export type Permission = {
  actions : Array<string>
  resources : Array<string>
}
export type Role = {
  name : string
  permissions : Array<Permission>
}
export type UserData = {
  name : string,
  email: string,
  roles : Array<Permission>
}
export type UserDetails = {
  name : string,
  email : string,
  password : string
}
export type Blacklist = {
  accessTokens : Array<string>
  refreshTokens : Array<string>
}
export type TokenData = {
  user:UserData
  fingerprint : string
}

export type LoginData = {
  email: string
  password: string
}

export type SignupData = {
  email: string
  password: string
  confirmPassword: string
}
