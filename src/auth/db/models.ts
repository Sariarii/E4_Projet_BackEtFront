import { model, Schema } from 'mongoose'
import uniqueValidator from "mongoose-unique-validator"
import httpErrors from "mongoose-errors"
import { Blacklist, UserData, UserDetails } from '../models'

const dbUserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  accessTokens: { type: [String], default: [] },
  refreshTokens: { type: [String], default: [] },
  roles : [{
    type: Schema.Types.ObjectId,
    ref: 'Role',
  }]
})
dbUserSchema.plugin(uniqueValidator)
dbUserSchema.plugin(httpErrors)

const DbUser = model<UserData & UserDetails & Blacklist>('User', dbUserSchema)

export { DbUser, dbUserSchema }

const dbRoleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  permissions: [{
    actions:[{
      type: String,
      required: true
    }],
    resources:[{
      type: String,
      required: true
    }]
  }],
})
dbRoleSchema.plugin(uniqueValidator)
dbRoleSchema.plugin(httpErrors)

const DbRole = model('Role', dbRoleSchema)

export { DbRole, dbRoleSchema }
