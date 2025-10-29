import { messageToast } from "../messages/message"
import { useAuth } from '~/composables/user/user'
import { useServerDetails } from "./getServerDetails"
import type { addingServer, fullServerDetails } from "./serverState"
// import { useHeartbeat } from "../../../server/api/heartbeat/heartbeat"

export const useAddServers = (serverState: Ref<addingServer>) => {
  const { showMessage } = messageToast()
  const { getServerDetails } = useServerDetails()
  // const { HeartbeatMaker } = useHeartbeat()
  const { idUser } = useAuth()

  const addServers = async () =>{
    const { csrfToken } = await $fetch('/api/secure/csrf')

    try{
      const res = await $fetch<{ success: boolean, message: string }>('/api/servers/addServers', {
        method: 'POST',
        body: {
          name: serverState.value.name,
          description: serverState.value.description,
          mac: serverState.value.mac,
          broadcast: serverState.value.broadcast,
          port: serverState.value.port,
          idCreator: idUser.value,
          csrfToken
        }
      })

      if(res.success){
        await getServerDetails()
        // await HeartbeatMaker(serverState.value.id)
        showMessage('success', res.message)

        serverState.value = {
          name: '',
          description: '',
          mac: '',
          broadcast: '',
          port: '9',
          isPublic: true
        }
      } else {
        showMessage('error', res.message)
      }
    } catch (err) {
      console.error('Error while sending the state to the server : ', err)
      showMessage('error', 'Server error while adding a server.')
    }
  }

  return{
    serverState,
    addServers
  }
}