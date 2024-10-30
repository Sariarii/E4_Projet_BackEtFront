import { NextFunction, Request, Response, Router } from "express"
import { DbUser } from "../auth/db/models"

export const createUserRoutes = () => {
    const userRoutes = Router()
    userRoutes.get(
      '/:id',
      async (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const user = (await DbUser.findOne({ _id: req.params.id }))!
          res.json({_id:user._id,name:user.name,email:user.email})
        } catch (error) {
          console.log(error);
          next(error)
        }
      }
    )

    userRoutes.get(
        '/',
        async (
          req: Request,
          res: Response,
          next: NextFunction
        ) => {
          try {
            const users = (await DbUser.find().limit(20).populate("roles"))!
            res.json(users.map(u=>({_id:u._id,name:u.name,email:u.email,roles:u.roles})))
          } catch (error) {
            console.log(error);
            next(error)
          }
        }
      )

    return userRoutes
}