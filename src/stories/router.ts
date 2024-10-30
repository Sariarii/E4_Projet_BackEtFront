import { NextFunction, Request, Router } from "express"
import {DbStory } from "./db/models"
import { StatusCodes } from "http-status-codes"


export const createStoriesRoutes = () => {
    const StoryRoutes = Router()
    StoryRoutes.post(
      '/story',
      ( req,
        res,
        next
      ) => {
        try {
            const newStory = new DbStory(req.body)
            newStory.save()
            res.sendStatus(StatusCodes.CREATED)
        } catch (error) {
            console.log(error);
            next(error)
        }
      }
    )

      
    StoryRoutes.put(
        '/:id',
        async ( req,
          res,
          next
        ) => {
          try {
            console.log("body",req.body);
            
              let stories = await DbStory.updateOne({_id:req.params.id},req.body)
              res.sendStatus(StatusCodes.CREATED)
          } catch (error) {
              console.log(error);
              next(error)
          }
        }
      )
  
      StoryRoutes.get(
        '/:id',
        async ( req,
          res,
          next
        ) => {
          try {
              let stories = await DbStory.findById(req.params.id)
              stories?.populate('name')
              res.json(stories)
          } catch (error) {
              console.log(error);
              next(error)
          }
        }
      )
  
      StoryRoutes.get(
        '/',
        async ( req,
          res,
          next
        ) => {
          try {
              let stories = await DbStory.find().limit(20).populate('name')
              res.json(stories)
          } catch (error) {
              console.log(error);
              next(error)
          }
        }
      )
  
      StoryRoutes.delete(
        '/:id',
        async ( req,
          res,
          next
        ) => {
          try {
              await DbStory.deleteOne(req.body.id)
              res.sendStatus(StatusCodes.OK)
          } catch (error) {
              console.log(error);
              next(error)
          }
        }
      )
    return StoryRoutes
}