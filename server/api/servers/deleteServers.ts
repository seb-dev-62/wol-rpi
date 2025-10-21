import { H3Event, readBody } from 'h3'
import { PrismaClient } from '@prisma/client'
import { updateServerDate } from './refreshList'

export default defineEventHandler(async (e: H3Event) => {
  const prisma = new PrismaClient()
  const body = await readBody(e)
  const { id } = body

  if(!id){
    return { success: false }
  }

  try {
    const deleteServer = await prisma.devices.delete({
      where: {
        iddevices: id
      }
    })

    if(deleteServer){
      updateServerDate()
      return { success: true }
    }
    return { success: false }
  } catch (err) {
    console.error(err)
    return { success: false }
  } finally {
    await prisma.$disconnect()
  }
})