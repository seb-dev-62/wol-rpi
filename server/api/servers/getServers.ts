import { H3Event } from 'h3'
import { PrismaClient } from "@prisma/client"


export default defineEventHandler(async (e: H3Event) => {
  const prisma = new PrismaClient
  const serverData = await prisma.devices.findMany()

  return serverData
})