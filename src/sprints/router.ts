import { NextFunction, Request, Router } from "express"
import { DbSprint } from "./db/models"
import { StatusCodes } from "http-status-codes"


export const createSprintsRoutes = () => {
    const SprintRoutes = Router()
    SprintRoutes.post(
      '/sprint',
      ( req,
        res,
        next
      ) => {
        try {
            const newSprint = new DbSprint(req.body)
            newSprint.save()
            res.sendStatus(StatusCodes.CREATED)
        } catch (error) {
            console.log(error);
            next(error)
        }
      }
    )

      
    SprintRoutes.put(
        '/:id',
        async ( req,
          res,
          next
        ) => {
          try {
            console.log("body",req.body);
            
              let sprints = await DbSprint.updateOne({_id:req.params.id},req.body)
              res.sendStatus(StatusCodes.CREATED)
          } catch (error) {
              console.log(error);
              next(error)
          }
        }
      )
  
      SprintRoutes.get(
        '/:id',
        async ( req,
          res,
          next
        ) => {
          try {
              let sprints = await DbSprint.findById(req.params.id)
              sprints?.populate('startDate','endDate')
              res.json(sprints)
          } catch (error) {
              console.log(error);
              next(error)
          }
        }
      )
  
      SprintRoutes.get(
        '/',
        async ( req,
          res,
          next
        ) => {
          try {
              let stories = await DbSprint.find().limit(20).populate('startDate')
              res.json(stories)
          } catch (error) {
              console.log(error);
              next(error)
          }
        }
      )
  
      SprintRoutes.delete(
        '/:id',
        async ( req,
          res,
          next
        ) => {
          try {
              await DbSprint.deleteOne({_id:req.params.id})
              res.sendStatus(StatusCodes.OK)
          } catch (error) {
              console.log(error);
              next(error)
          }
        }
      )
    return SprintRoutes
}