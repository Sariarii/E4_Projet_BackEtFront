import { compare, hash } from 'bcrypt'
import express, { NextFunction, Router } from 'express'
import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'
import { decode } from 'jsonwebtoken'
import { DbUser } from './db/models'
import { blackListAccessToken, blackListRefreshToken } from './db/util'
import { checkAccessToken, checkRefreshToken } from './midlewares'
import { LoginData, SignupData, TokenData, UserData,Role } from './models'
import { addAccessToken, addRefreshToken, createTokenUser, createUserFingerprint } from './util'

declare module 'express' {
  export interface Request {
    // accessToken?: string
    user?: UserData
  }
}

export const createAuthRoutes = () => {
  const authRoutes = Router()
  authRoutes.post(
    '/signup',
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const { email, password, confirmPassword } : SignupData = req.body
      if (!email || !password || password !== confirmPassword) {
        next(createHttpError(StatusCodes.BAD_REQUEST))
        return
      }

      try {
        const newUser = new DbUser({
          email,
          password: await hash(password, 12),
          permissions: []
        })
        await newUser.save()
        res.sendStatus(StatusCodes.CREATED)
      } catch (error) {
        console.log(error);
        next(error)
      }
    }
  )

  authRoutes.post(
    '/login',
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const { email, password } : LoginData = req.body
      try {
        const dbUser = await DbUser.findOne({ email })
        console.log(dbUser);
        if (!dbUser) {
          next(createHttpError(StatusCodes.UNAUTHORIZED))
          return
        }

        if (!(await compare(password, dbUser.password))) {
          next(createHttpError(StatusCodes.UNAUTHORIZED))
          return
        }

        const accessToken : string = req.signedCookies[process.env.JWT_ACCESS_TOKEN_NAME!]
  
        if(accessToken!=undefined && accessToken!="undefined" && accessToken!=""){
          const data = decode(accessToken) as TokenData
          blackListAccessToken(data.user,accessToken)
        }
        
        const user = await createTokenUser(dbUser,req)
        const fingerprint = await createUserFingerprint(req)
    
        addAccessToken({user,fingerprint},res)
        
        const refreshToken = req.signedCookies[process.env.JWT_REFRESH_TOKEN_NAME!]
        if(refreshToken!=undefined  && refreshToken!="undefined" && refreshToken!=null){
          const data = decode(refreshToken) as TokenData
          blackListRefreshToken(data.user,refreshToken)
        }
        addRefreshToken({user,fingerprint},res)
        
        res.sendStatus(StatusCodes.OK)
      } catch (error) {
        console.log(error);
        next(error)
      }
    }
  )

  authRoutes.all(
    '/logout',
    checkAccessToken,
    async (req: express.Request, res: express.Response,next:NextFunction) => {
      const accessToken = req.signedCookies[process.env.JWT_ACCESS_TOKEN_NAME!]
      const refreshToken = req.signedCookies[process.env.JWT_REFRESH_TOKEN_NAME!]
      try {
        req.user = undefined
        
        blackListAccessToken(req.user!,accessToken)
        res.clearCookie(process.env.JWT_ACCESS_TOKEN_NAME!)
        
        blackListRefreshToken(req.user!,refreshToken)
        res.clearCookie(process.env.JWT_REFRESH_TOKEN_NAME!)

        res.sendStatus(StatusCodes.OK)
      } catch (error) {
        console.log(error);
        next(error)
      }
    }
  )

  authRoutes.post("/refresh", checkRefreshToken, async (req: express.Request, res: express.Response) => {
    
    const accessToken = req.signedCookies[process.env.JWT_ACCESS_TOKEN_NAME!]
    blackListAccessToken(req.user!,accessToken)
    
    
    const fingerprint = await createUserFingerprint(req)
    addAccessToken({user:req.user!,fingerprint},res)

    const refreshToken = req.signedCookies[process.env.JWT_REFRESH_TOKEN_NAME!]
    blackListAccessToken(req.user!,refreshToken)
    addRefreshToken({user:req.user!,fingerprint},res)

    res.sendStatus(StatusCodes.OK)
  })
  return authRoutes
}
