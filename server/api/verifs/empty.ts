import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient

export default defineEventHandler(async () => {
  const userEmpty = (await prisma.users.count()) === 0
  return { userEmpty }
})
