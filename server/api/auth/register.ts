import { PrismaClient } from "@prisma/client"
import { H3Event, readBody } from 'h3'
import bcrypt from 'bcrypt'
import { csrf_verif } from "#imports"

export default defineEventHandler(async (e: H3Event) => {
  const prisma = new PrismaClient()
  const body = await readBody(e)
  const { username, password, code, email, csrfToken } = body
  const sessionID = getCookie(e, 'session_id') || 'guest'

  if(!csrf_verif(sessionID, csrfToken)){
    throw createError({ statusCode: 403, message: 'Invalid CSRF token' })
  }

  const codeData = await prisma.userCode.findFirst({
    where: { code: code }
  })

  try{
    const hashedPass = await bcrypt.hash(password, 10)

    if(code !== codeData?.code){
      return { success: false, message: 'The code you gave is not registred.' }
    }

    if(codeData?.isActivated){
      return { success: false, message: 'The code you gave is already activated.' }
    }

    if(username !== codeData?.username){
      return { success: false, message: 'Your username is not linked to the code you gave.' }
    }
    
    await prisma.users.create({
      data: {
        username,
        password: hashedPass,
        role: codeData?.role,
        ...(email ? { email } : {})
      }
    })

    await prisma.userCode.update({
      where: { code: code },
      data: { isActivated: true }
    })

    return { success: true }
  } catch(err) {
    console.error(err)
  } finally {
    prisma.$disconnect()
  }
})