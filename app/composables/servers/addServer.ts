import { messageToast } from "../messages/message"
import { useAuth } from '~/composables/user/user'
import { useServerDetails } from "./getServerDetails"
import type { editableServer } from "./serverState"

export const useAddServers = (serverState: Ref<editableServer>) => {
  const { showMessage } = messageToast()
  const { getServerDetails } = useServerDetails()
  const { idUser } = useAuth()

  const addServers = async () =>{
    
    try{
      const res = await $fetch<{ success: boolean }>('/api/servers/addServers', {
        method: 'POST',
        body: serverState.value
      })

      if(res.success){
        await getServerDetails()
        showMessage('success', 'Server added.')

        serverState.value = {
          id: 0,
          name: '',
          description: '',
          mac: '',
          broadcast: '',
          port: '9',
          isPublic: true,
          idCreator: idUser.value
        }
      } else {
        showMessage('error', 'Error while adding the server.')
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