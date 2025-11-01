import { H3Event } from 'h3'
import pkg from "@prisma/client"

const { PrismaClient } = pkg

export default defineEventHandler(async (e: H3Event) => {
  const prisma = new PrismaClient
  const codes = await prisma.userCode.findMany()

  const referer = getHeader(e, 'referer')
  if(!referer || !referer.startsWith('http://')){
    throw createError({ statusCode: 403, statusMessage: 'Invalid origin' })
  }

  return { codes, success: true}
})