import mongoose from 'mongoose'
import { schedule } from 'node-cron'
import { cleanExpiredAccessTokensFromDB } from './auth/db/util'
import { createApp } from './createApp'
import { clearDb, seedDatabase } from './utils/db'
import { DbRole, DbUser } from './auth/db/models'

const app = createApp()

mongoose.connect(process.env.MONGO_URI!).then(async () => {
  console.log('Connected to MongoDB!')

  //await clearDb()
  await seedDatabase()
  app.listen(process.env.PORT, () => {
    console.log('Server started on port', process.env.PORT)
  })
})

const everySomething = process.env.SCHEDULE_CLEANING_FREQUENCY!
schedule(everySomething, cleanExpiredAccessTokensFromDB)
