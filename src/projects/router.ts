import { NextFunction, Request, Router } from "express"
import { DbProject } from "./db/models"
import {DbStory} from "../stories/db/models"
import { StatusCodes } from "http-status-codes"
import { DbUser } from "../auth/db/models"
import { DbSprint } from "../sprints/db/models"

export const createProjectRoutes = () => {
    const projectRoutes = Router()
    projectRoutes.post(
      '/createProject',
      ( req,
        res,
        next
      ) => {
        try {
            const newProject = new DbProject(req.body)
            newProject.save()
            res.sendStatus(StatusCodes.CREATED)
        } catch (error) {
            console.log(error);
            next(error)
        }
      }
    )

    projectRoutes.put(
      '/:id',
      async ( req,
        res,
        next
      ) => {
        try {
          console.log("body",req.body);
          
            let project = await DbProject.updateOne({_id:req.params.id},req.body)
            res.sendStatus(StatusCodes.CREATED)
        } catch (error) {
            console.log(error);
            next(error)
        }
      }
    )

    projectRoutes.get(
      '/:id',
      async ( req,
        res,
        next
      ) => {
        try {
            let project = await DbProject.findById(req.params.id)
            project?.populate('leader')
            res.json(project)
        } catch (error) {
            console.log(error);
            next(error)
        }
      }
    )

    projectRoutes.get(
      '/',
      async ( req,
        res,
        next
      ) => {
        try {
            let projects = await DbProject.find().limit(20).populate('leader','_id name email')
            res.json(projects)
        } catch (error) {
            console.log(error);
            next(error)
        }
      }
    )

    projectRoutes.delete(
      '/:id',
      async ( req,
        res,
        next
      ) => {
        try {
            await DbProject.deleteOne({_id:req.params.id})
            res.sendStatus(StatusCodes.OK)
        } catch (error) {
            console.log(error);
            next(error)
        }
      }
    )

    projectRoutes.post(
      '/:id/stories',
      async ( req,
        res,
        next
      ) => {
        try {
          let project = await DbProject.findById(req.params.id)
          let story = await DbStory.findById(req.body.story)
          if (!story) {
            res.sendStatus(StatusCodes.NOT_FOUND)
          } else {
            project?.stories.push(req.body.story)
            project?.save()
            res.sendStatus(StatusCodes.OK)
          }
        } catch (error) {
            console.log(error);
            next(error)
        }
      }
    )

    projectRoutes.post(
      '/:id/participants',
      async ( req,
        res,
        next
      ) => {
        try {
          let project = await DbProject.findById(req.params.id)
          let participant = await DbUser.findById(req.body.participant)
          if (!participant) {
            res.sendStatus(StatusCodes.NOT_FOUND)
          } else {
            project?.participants.push(req.body.participant)
            project?.save()
            res.sendStatus(StatusCodes.OK)
          }
        } catch (error) {
            console.log(error);
            next(error)
        }
      }
    )

    projectRoutes.post(
      '/:id/sprints',
      async ( req,
        res,
        next
      ) => {
        try {
          let project = await DbProject.findById(req.params.id)
          let sprint = await DbSprint.findById(req.body.sprint)
          if (!sprint) {
            res.sendStatus(StatusCodes.NOT_FOUND)
          } else {
            project?.sprints.push(req.body.sprint)
            project?.save()
            res.sendStatus(StatusCodes.OK)
          }
        } catch (error) {
            console.log(error);
            next(error)
        }
      }
    )

    return projectRoutes
}