import { H3Event, readBody } from 'h3'
import { PrismaClient } from '@prisma/client'
import { updateServerDate } from './refreshList'
import { csrf_verif } from '#imports'

export default defineEventHandler(async (e: H3Event) => {
  const prisma = new PrismaClient
  const body = await readBody(e)
  const { id, name, description, mac, broadcast, port, isPublic, csrfToken } = body
  const sessionID = getCookie(e, 'session_id') || 'guest'

  if(!name){
    return { success: false, message: 'Name is required.'}
  }

  if(!broadcast){
    return { success: false, message: 'broadcast is required.'}
  }

  if(!mac){
    return { success: false, message: 'mac is required.'}
  }

  if(!port){
    return { success: false, message: 'port is required.'}
  }

  if(!id){
    return { success: false, message: "Device's ID is missing." }
  }

  if(!csrf_verif(sessionID, csrfToken)){
    throw createError({ statusCode: 403, message: 'Invalid CSRF token' })
  }

  const existingServer = await prisma.devices.findFirst({
    where: {
      OR: [{ name }, { mac }],
      NOT: { iddevices: id }
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