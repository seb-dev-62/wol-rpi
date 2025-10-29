import { PrismaClient } from '@prisma/client'
import { readBody, H3Event } from 'h3'

export default defineEventHandler(async (e: H3Event) => {
  const prisma = new PrismaClient()
  const body = await readBody(e)
  const { idcode, csrfToken } = body
  const sessionID = getCookie(e, 'session_id') || 'guest'

  if(!csrf_verif(sessionID, csrfToken)){
      return { success: false, message: "Invalid CSRF token", statusCode: 403 }
    }

  try{
    await prisma.userCode.delete({
      where: { idusercode: idcode }
    })

    return { success: true, message: `The code has been deleted.` }
  } catch (err) {
    console.error(err)
    return { success: false, message: 'An error occurred while deleting the code.' }
  }
})