import express from 'express'
import createHttpError from "http-errors"
import { StatusCodes } from 'http-status-codes'
import { verify } from 'jsonwebtoken'
import { DbUser } from './db/models'
import { TokenData } from './models'
import { addAccessToken, addRefreshToken, createTokenUser, createUserFingerprint } from './util'

export const checkAccessToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  
  const token = req.signedCookies[process.env.JWT_ACCESS_TOKEN_NAME!]
  
  if (!token) {

    next(createHttpError(StatusCodes.UNAUTHORIZED))
    return
  }
  try {
    const data = verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET!
    ) as TokenData
    
    const dbUser = await DbUser.findOne({ email: data.user.email })
    if (!dbUser) {
      next(createHttpError(StatusCodes.UNAUTHORIZED))
      return
    }
    if (dbUser.accessTokens.includes(token)) {
      next(createHttpError(StatusCodes.UNAUTHORIZED))
      return
    }

    const user = await createTokenUser(data.user,req)
    const fingerprint = await createUserFingerprint(req)
    
    req.user = user

    addAccessToken({user,fingerprint},res)
    addRefreshToken({user,fingerprint},res)
    
    next()

  } catch (error) {
    console.log(error);
    next(createHttpError(StatusCodes.UNAUTHORIZED))
  }
}

export const checkRefreshToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.signedCookies[process.env.JWT_REFRESH_TOKEN_NAME!]
  if (!token) {
    next(createHttpError(StatusCodes.UNAUTHORIZED))
    return
  }
  try {
    const data = verify(
      token,
      process.env.JWT_REFRESH_TOKEN_SECRET!
    ) as TokenData

    const dbUser = await DbUser.findOne({ email: data.user.email })
    if (!dbUser) {
      next(createHttpError(StatusCodes.UNAUTHORIZED))
      return
    }
    if (dbUser.refreshTokens.includes(token)) {
      next(createHttpError(StatusCodes.UNAUTHORIZED))
      return
    }
    
    const user = await createTokenUser(data.user,req)
    const fingerprint = await createUserFingerprint(req)
    
    req.user = user

    addAccessToken({user,fingerprint},res)
    addRefreshToken({user,fingerprint},res)
    
    next()
  } catch (error) {
    console.log(error);
    next(error)
  }
}

// function refreshAccessToken(user:TokenUser,res:Response){
//   const token = createAccessToken(user)
//   res.cookie(process.env.JWT_ACCESS_TOKEN_NAME!,token)
// }