import { NextFunction, Request, Router } from "express"
import {DbTask } from "./db/models"
import { StatusCodes } from "http-status-codes"


export const createTasksRoutes = () => {
    const TaskRoutes = Router()
    TaskRoutes.post(
      '/task',
      ( req,
        res,
        next
      ) => {
        try {
            const newTask = new DbTask(req.body)
            newTask.save()
            res.sendStatus(StatusCodes.CREATED)
        } catch (error) {
            console.log(error);
            next(error)
        }
      }
    )

      
    TaskRoutes.put(
        '/:id',
        async ( req,
          res,
          next
        ) => {
          try {
            console.log("body",req.body);
            
              let tasks = await DbTask.updateOne({_id:req.params.id},req.body)
              res.sendStatus(StatusCodes.CREATED)
          } catch (error) {
              console.log(error);
              next(error)
          }
        }
      )
  
      TaskRoutes.get(
        '/:id',
        async ( req,
          res,
          next
        ) => {
          try {
              let tasks = await DbTask.findById(req.params.id)
              tasks?.populate('name','done')
              res.json(tasks)
          } catch (error) {
              console.log(error);
              next(error)
          }
        }
      )
  
      TaskRoutes.get(
        '/',
        async ( req,
          res,
          next
        ) => {
          try {
              let tasks = await DbTask.find().limit(20).populate('name','done')
              res.json(tasks)
          } catch (error) {
              console.log(error);
              next(error)
          }
        }
      )
  
      TaskRoutes.delete(
        '/:id',
        async ( req,
          res,
          next
        ) => {
          try {
              await DbTask.deleteOne({_id:req.params.id})
              res.sendStatus(StatusCodes.OK)
          } catch (error) {
              console.log(error);
              next(error)
          }
        }
      )
    return TaskRoutes
}