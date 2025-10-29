import { PrismaClient } from "@prisma/client"
import { H3Event, readBody } from 'h3'
import { csrf_verif } from "#imports"

function createCode(){
  const randomNumbers = Math.floor(Math.random() * 10000000)

  const formattedNumbers = randomNumbers.toString().padStart(7, '0')

  return `wol-${formattedNumbers}`
}

export default defineEventHandler(async (e: H3Event) => {
  const prisma = new PrismaClient()
  const body = await readBody(e)
  const { username, expires, role, csrfToken } = body
  const sessionID = getCookie(e, 'session_id') || 'guest'

  if(!csrf_verif(sessionID, csrfToken)){
    return { success: false, message: "Invalid CSRF token", statusCode: 403 }
  }

  let hiddenCode = createCode()

  let existCode = await prisma.userCode.findFirst({
    where: {
      code: hiddenCode
    }
  })

  while(existCode){
    hiddenCode = createCode()

    existCode = await prisma.userCode.findFirst({
      where: {
        code: hiddenCode
      }
    })
  }

  try {
    if (typeof username === 'string' && username.trim() !== '') {
      await prisma.userCode.create({
        data: {
          username: username,
          code: hiddenCode,
          expiresAt: expires,
          role: role
        }
      })

      return { success: true, message: `User ${username} can now use the code ${hiddenCode} to register.` }
    }
  } catch (err){
    console.error(err)
  } finally {
    await prisma.$disconnect()
  }
})