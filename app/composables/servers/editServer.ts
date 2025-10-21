import { messageToast } from "../messages/message"
import { useServerDetails } from "./getServerDetails"
import type { editableServer } from "./serverState"

export const useEditServer = (serverState: Ref<editableServer>) => {
  const { showMessage } = messageToast()
  const { getServerDetails } = useServerDetails()

  const editServer = async () => {
    console.log(serverState.value)
    
    try{
      const res = await $fetch<{ succes: boolean }>('/api/servers/editServers', {
        method: "POST",
        body: serverState.value
      })

      if(res.succes){
        console.log('Just updated')
        await getServerDetails()
        showMessage('success', `The server ${serverState.value.name} is edited.`)
      } else {
        showMessage('success', `Something went wrong while modifiyng ${serverState.value.name}.`)
      }
    } catch(err) {
      console.error('Error while editing server.', err);
      showMessage('error', 'Error while editing the server.')
    }
  }

  return{ editServer }
}