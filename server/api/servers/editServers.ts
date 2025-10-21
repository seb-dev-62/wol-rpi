import { H3Event, readBody } from 'h3'
import { PrismaClient } from '@prisma/client'
import { updateServerDate } from './refreshList'

export default defineEventHandler(async (e: H3Event) => {
  const prisma = new PrismaClient
  const body = await readBody(e)
  const { id, name, description, mac, broadcast, port, isPublic } = body

  if(!name || !mac || !broadcast || !port || isPublic === undefined){
    return { success: false, message: 'All fields are required.'}
  }

  if(!id){
    return { success: false, message: "Device's ID is missing." }
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
    await prisma.devices.update({
      where: { iddevices: id },
      data: {
        name,
        description,
        mac,
        broadcast,
        port: parseInt(port),
        is_public: isPublic
      }
    })
    
    updateServerDate()
    return { success: true }
  } catch (err) {
    console.error('Error while creating the server : ', err)
    return { success: false }
  }
})