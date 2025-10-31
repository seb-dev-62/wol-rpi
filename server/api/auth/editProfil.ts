import { readBody, H3Event } from "h3"
import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcrypt'

export default defineEventHandler(async (e: H3Event) => {
  const prisma = new PrismaClient()
  const body = await readBody(e)

  const { password, type, username, email, idUser, csrfToken } = body
  const sessionID = getCookie(e, 'session_id') || 'guest'

  if(!csrf_verif(sessionID, csrfToken)){
    return { success: false, message: `Invalid CSRF token ${csrfToken}`, statusCode: 403 }
  }

  if(idUser === undefined){
    return { success: false, message: "No modification is possible, your ID is missing." }
  }

  switch (type) {
    case 'password':
      if(password === undefined){
        return { success: false, message: "Password field is empty." }
      }

      const hashedPasword = bcrypt.hash(password, 10)

      try{
        await prisma.users.update({
          where: { idusers: idUser },
          data: hashedPasword
        })

        return { success: true, message: "Your password has been updated." }
      } catch(err) {
        console.error(err)
        return { success: false, message: "Error while updating your password." }
      } finally {
        prisma.$disconnect()
      }
      break;
    
    case 'personnalData':
      if(username === undefined){
        return { success: false, message: "The username can't be empty." }
      }

      try{
        await prisma.users.update({
          where: { idusers: idUser },
          data: {
            username: username,
            email: email
          }
        })

        return { success: true, message: "Data updated." }
      } catch(err) {
        console.error(err)
        return { success: false, message: "Error while updating the username or email." }
      } finally {
        prisma.$disconnect()
      }
      break;
  
    default:
      break;
  }
})