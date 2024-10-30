import { JwtPayload, verify } from "jsonwebtoken"
import { UserData } from "../models"
import { DbUser } from "./models"


export const cleanExpiredAccessTokensFromDB = async () => {
    const usersWithTokens = await DbUser.find({
      expiredAccessTokens: { $exists: true, $not: { $size: 0 } }
    }).limit(100)
    for (const user of usersWithTokens) {
      for (const dbToken of user.accessTokens) {
        try {
          const token = verify(
            dbToken,
            process.env.JWT_ACCESS_TOKEN_SECRET!
          ) as JwtPayload
        } catch (error) {
          await DbUser.updateOne(
            { email: user.email },
            { $pull: { expiredAccessTokens: dbToken } }
          )
        }
      }
    }
  }

export async function blackListAccessToken(user:UserData,token:string){
    const dbUser = await DbUser.findOne({ email: user.email })
    dbUser!.accessTokens.push(token as string)
    await dbUser!.save()
}

export async function blackListRefreshToken(user:UserData,token:string){
    const dbUser = await DbUser.findOne({ email: user.email })
    dbUser!.refreshTokens.push(token as string)
    await dbUser!.save()
}