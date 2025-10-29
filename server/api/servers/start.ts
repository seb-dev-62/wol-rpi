import { H3Event, readBody } from 'h3'
import * as wol from 'wol'

export default defineEventHandler(async (e: H3Event) => {
  const body = await readBody(e)

  try{
    const { mac, broadcast, port } = body

    if(!mac || !broadcast || !port){
      return { success: false, message: "The MAC, Broadcast or Port is missing." }
    }

    await wol.wake(mac, { address: broadcast, port: parseInt(port) })
    console.log('Magic packet sent')
    return { success: true }
  } catch (err){
    console.error('Error while sending the magic packet: ', err)
    return { success: false }
  }
})