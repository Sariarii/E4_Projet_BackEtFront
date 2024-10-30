import { hash } from 'bcrypt'
import { Request, Response } from 'express'
import { JwtPayload, sign, verify, } from 'jsonwebtoken'
import { DbUser } from './db/models'
import { TokenData, UserData } from './models'


export function createAccessToken(user : TokenData){
  return sign(user, process.env.JWT_ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_LIFETIME!
  })
}

export function createRefreshToken(user : TokenData){
  return sign(user, process.env.JWT_REFRESH_TOKEN_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_LIFETIME!
  })
}

export function addAccessToken(user: TokenData,res:Response){
  const token = createAccessToken(user)
  
  res.cookie(process.env.JWT_ACCESS_TOKEN_NAME!, token, {
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    httpOnly: true
  })
}

export function addRefreshToken(user: TokenData,res:Response){
  const token = createRefreshToken(user)
  res.cookie(process.env.JWT_REFRESH_TOKEN_NAME!, token, {
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    httpOnly: true
  })
}

export async function createTokenUser(user : UserData,req:Request){
  return {
    name:user.name,
    email: user.email,
    roles : []
  }
}

export async function createUserFingerprint(req:Request){
  const xForwardedFor = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || ""  
  const ip = xForwardedFor.split(",")[0]
  return await hash(ip,12)
}