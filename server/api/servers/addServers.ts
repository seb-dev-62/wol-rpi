import { H3Event, readBody } from 'h3'
import { PrismaClient } from '@prisma/client'
import { updateServerDate } from './refreshList'

export default defineEventHandler(async (e: H3Event) => {
  const prisma = new PrismaClient
  const body = await readBody(e)
  const { name, description, mac, broadcast, port, isPublic, idCreator } = body

  if(!name){
    return { success: false, message: 'Name is required.'}
  }

  if(!broadcast){
    return { success: false, message: 'Broadcast is required.'}
  }

  if(!mac){
    return { success: false, message: 'Mac is required.'}
  }

  if(!port){
    return { success: false, message: 'Port is required.'}
  }

  if(!idCreator){    
    return { success: false, message: 'Your ID couldn\'t be retrieved' }
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
    return { success: true, message: `Server ${name} added.` }
  } catch (err) {
    console.error('Error while creating the server : ', err)
    return { success: false }
  }
})