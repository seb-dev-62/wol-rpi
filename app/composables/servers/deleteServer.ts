import { messageToast } from "../messages/message"
import { useServerDetails } from "./getServerDetails"
import type { deleteServer } from "./serverState"

export const useDeleteServers = (serverState: Ref<deleteServer>) => {
  const { showMessage } = messageToast()
  const { getServerDetails } = useServerDetails()

  const deleteServer = async () =>{
    console.log('ID of the server to delete : ' + serverState.value.id);
    
    try{
      const res = await $fetch<{ success: boolean }>('/api/servers/deleteServers', {
        method: 'DELETE',
        body: {id: serverState.value.id}
      })

      if(res.success){
        await getServerDetails()
        showMessage('success', `The server ${serverState.value.name} is deleted.`)
      } else {
        showMessage('error', `Failed to delete the server.`)
      }
    } catch (err) {
      console.error(err)
      showMessage('error', 'Server error while deleting the server.')
    }
  }

  return{ deleteServer }
}