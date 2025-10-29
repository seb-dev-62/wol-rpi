import { messageToast } from "../messages/message"
import { useServerDetails } from "./getServerDetails"
import { useAuth } from '~/composables/user/user'
import type { editableServer } from "./serverState"

export const useEditServer = (serverState: Ref<editableServer>) => {
  const { showMessage } = messageToast()
  const { getServerDetails } = useServerDetails()
  
  const { idUser } = useAuth()

  const editServer = async () => {
    const { csrfToken } = await $fetch('/api/secure/csrf')

    try{
      const res = await $fetch<{ success: boolean, message: string }>('/api/servers/editServers', {
        method: "POST",
        body: {
          id: serverState.value.id,
          name: serverState.value.name,
          description: serverState.value.description,
          mac: serverState.value.mac,
          broadcast: serverState.value.broadcast,
          port: serverState.value.port,
          csrfToken
        }
      })

      if(res.success){
        await getServerDetails()
        showMessage('success', `The server ${serverState.value.name} is edited.`)

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
        showMessage('error', res.message)
      }
    } catch(err) {
      console.error('Error while editing server.', err);
      showMessage('error', 'Error while editing the server.')
    }
  }

  return{ editServer }
}