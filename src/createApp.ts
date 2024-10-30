import cookieParser from 'cookie-parser'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { checkAccessToken } from './auth/midlewares'
import { createAuthRoutes } from './auth/router'
import {HttpError} from "http-errors"
import { createProjectRoutes } from './projects/router'
import { createStoriesRoutes } from './stories/router'
import { createSprintsRoutes } from './sprints/router'
import { createTasksRoutes } from './tasks/router'
import errorHandler from "errorhandler"
import { createUserRoutes } from './users/router'
import helmet from 'helmet'
import lusca from 'lusca'

export const createApp = () => {
  const app = express()
  app.use(helmet())
  app.use(lusca())

  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  app.use(cookieParser(process.env.COOKIE_SECRET!))

  app.use(createAuthRoutes())
  app.use('/projects',checkAccessToken,createProjectRoutes())
  app.use('/stories',checkAccessToken,createStoriesRoutes())
  app.use('/sprints',checkAccessToken,createSprintsRoutes())
  app.use('/tasks',checkAccessToken,createTasksRoutes())
  app.use('/users',checkAccessToken,createUserRoutes())
  app.get('/', checkAccessToken, (req: express.Request, res: express.Response) => {
    res.send('Hello World!')
  })

  if (process.env.NODE_ENV !== 'production') {    
    app.use(errorHandler())
  }
  else {
    const handleErrors = (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.log(err)
      if (err instanceof HttpError) {
        res.status(err.status)
        res.send(err.message)
        return
      }
      res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
    }
    
    app.use(handleErrors)
  }

  return app
}
