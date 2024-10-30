import mongoose, { model, Schema } from 'mongoose'
import uniqueValidator from "mongoose-unique-validator"
import httpErrors from "mongoose-errors"

const dbSprintSchema = new Schema({
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
})

dbSprintSchema.plugin(uniqueValidator)
dbSprintSchema.plugin(httpErrors)

const DbSprint = model('Sprint', dbSprintSchema)
export { DbSprint, dbSprintSchema }