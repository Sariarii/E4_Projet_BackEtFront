import { hash } from "bcrypt";
import { DbRole, DbUser } from "../auth/db/models";

export async function seedDatabase(){
    const users = await DbUser.find()
    console.log(users.map((u)=>u.name));

    const roles = await DbRole.find()
    console.log(roles.map((r)=>r.name));
    
    if(roles.length == 0){
        let leader = new DbRole({
            name : "leader",
            permissions:[
                {
                    resources:["participant","po","sm"],
                    actions:["add","remove"]
                }
            ]
        })
        await leader.save()
        const po = new DbRole({
            name : "po",
            permissions:[
                {
                    resources:["story"],
                    actions:["create","delete","priorize"]
                }
            ]
        })
        await po.save()
        const sm = new DbRole({
            name : "sm",
            permissions:[
                {
                    resources:["sprint"],
                    actions:["create","update","delete","read","list"]
                },
                {
                    resources:["story"],
                    actions:["move","remove"]
                }
            ]
        })
        await sm.save()
        const participant = new DbRole({
            name : "participant",
            permissions:[
                {
                    resources:["task"],
                    actions:["create","update","delete"]
                },
                {
                    resources:["story"],
                    actions:["estimate"]
                }
            ]
        })
        await participant.save()
        const users = await DbUser.find()
        if(users.length == 0){
            const louis = new DbUser({
                name : "Louis",
                email:"louis@acme.com",
                password:await hash("azerty",12),
                roles : [leader]
            })
            await louis.save()
            const paul = new DbUser({
                name : "Paul",
                email:"paul@acme.com",
                password:await hash("azerty",12),
                roles : [po]
            })
            await paul.save()
            const sam = new DbUser({
                name : "Sam",
                email:"sam@acme.com",
                password:await hash("azerty",12),
                roles : [sm]
            })
            await sam.save()
            const dom = new DbUser({
                name : "Dom",
                email:"dom@acme.com",
                password:await hash("azerty",12),
                roles : [participant]
            })
            await dom.save()
            const denise = new DbUser({
                name : "Denise",
                email:"denise@acme.com",
                password:await hash("azerty",12),
                roles : [participant]
            })
            await denise.save()
            const daniel = new DbUser({
                name : "Daniel",
                email:"daniel@acme.com",
                password:await hash("azerty",12),
                roles : [participant]
            })
            await daniel.save()
        }
    }
}

export async function clearDb(){
    const users = await DbUser.find()
  for(const user of users){
    console.log("deleting user ",user._id,"...");
    await DbUser.deleteOne({_id:user._id})
  }
  const roles = await DbRole.find()
  for(const role of roles){
    console.log("deleting role ",role._id,"...");
    await DbRole.deleteOne({_id:role._id})
  }
}