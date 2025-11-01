import pkg from '@prisma/client'
import { H3Event } from 'h3'

const { PrismaClient } = pkg

export default defineEventHandler(async (e: H3Event) => {
  const prisma = new PrismaClient()

  const referer = getHeader(e, 'referer')
  if(!referer || !referer.startsWith('http://')){
    throw createError({ statusCode: 403, statusMessage: 'Invalid origin' })
  }

  try{
    const users = await prisma.users.findMany()

    return { users, success: true }
  } catch(err) {
    console.error(err)
    return { success: false }
  } finally {
    prisma.$disconnect()
  }
})