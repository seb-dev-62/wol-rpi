import { H3Event, readBody } from 'h3'
import { PrismaClient } from '@prisma/client'
import { updateServerDate } from './refreshList'

export default defineEventHandler(async (e: H3Event) => {
  const prisma = new PrismaClient
  const body = await readBody(e)
  const { name, description, mac, broadcast, port, isPublic, idCreator } = body

  if(!name || !mac || !broadcast || !port || isPublic === undefined){
    return { success: false, message: 'All fields are required.'}
  }

  if(!idCreator){
    return { success: false, message: 'Your ID could\'t be retrieved' }
  }

  const existingServer = await prisma.devices.findFirst({
    where: {
      OR: [{ name }, { mac }]
    }
  })

  if(existingServer){
    return { success: false, message: 'A server allready own this name or mac address.' }
  }

  try {
    await prisma.devices.create({
      data: {
        name,
        description,
        mac,
        broadcast,
        port: parseInt(port),
        is_public: isPublic,
        users: {
          connect: { idusers: idCreator }
        }
      }
    })
    
    updateServerDate()
    return { success: true }
  } catch (err) {
    console.error('Error while creating the server : ', err)
    return { success: false }
  }
})