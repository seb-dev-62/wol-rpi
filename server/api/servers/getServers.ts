import { H3Event } from 'h3'
import pkg from "@prisma/client"

const { PrismaClient } = pkg

export default defineEventHandler(async (e: H3Event) => {
  const prisma = new PrismaClient
  const serverData = await prisma.devices.findMany()

  return serverData
})