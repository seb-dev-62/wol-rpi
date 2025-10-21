import { PrismaClient } from "@prisma/client"
import { H3Event, readBody } from 'h3'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export default defineEventHandler(async (e: H3Event) => {
  const body = await readBody(e)
  const { username, password, email, firstAdmin, role } = body

  if(!username || !password) {
    return { success: false, message: 'Some fields are missing.' }
  }

  const existingUser = await prisma.users.findFirst({
    where: {
      OR: [{ username }, { email }]
    }
  })

  if(existingUser){
    return { success: false, message: 'A user with the email or username allready exist.' }
  }

  try {
    // Hash users password
    const hashedPass = await bcrypt.hash(password, 10)

    await prisma.users.create({
      data: {
        username,
        password: hashedPass,
        email,
        firstAdmin,
        role
      }
    })

    return { success: true }
  } catch (err) {
    console.log(err);
    
    return { success: false, message: 'An error has occured while creating the user.' }
  }
})