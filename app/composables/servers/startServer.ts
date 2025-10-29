import type { fullServerDetails } from "./serverState"
import { messageToast } from "../messages/message"

export const useStartServer = () => {
  const { showMessage } = messageToast()
  const startServer = async (server: fullServerDetails) => {
    try{
      const res = await $fetch<{ success: boolean }>('/api/servers/start', {
        method: 'POST',
        body: {
          mac: server.mac,
          broadcast: server.broadcast,
          port: server.port
        }
      })

      if(res.success){
        showMessage('success', "Server is starting.")
        
      } else {
        showMessage('error', "Error while sending server data.")
      }
    } catch(err){
      console.error(err)
    }
  }

  return { startServer }
}