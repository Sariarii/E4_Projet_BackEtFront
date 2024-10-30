import mongoose, { model, Schema } from 'mongoose'
import uniqueValidator from "mongoose-unique-validator"
import httpErrors from "mongoose-errors"

const dbTaskSchema = new Schema({
    name: { type: String, required: true },
    done: { type: Boolean,required: true },
    tasks:[{type:mongoose.Types.ObjectId,ref:'Task'}]
})

dbTaskSchema.plugin(uniqueValidator)
dbTaskSchema.plugin(httpErrors)

const DbTask = model('Task', dbTaskSchema)
export { DbTask, dbTaskSchema }