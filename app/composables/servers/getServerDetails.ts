import { messageToast } from '~/composables/messages/message'
import { useServerData } from '~/composables/servers/serverState'

export const useServerDetails = () => {

  const { showMessage } = messageToast()
  const { serverList } = useServerData()


  const getServerDetails = async () => {
    try{
      const res = await $fetch('/api/servers/getServers', {
        method: "GET"
      })

      if (!res){
        showMessage('error', 'No server found')
        return
      }

      serverList.value = res.map((item: any) => ({
        id: item.iddevices,
        name: item.name,
        status: 'Offline',
        description: item.description ?? '',
        broadcast: item.broadcast,
        mac: item.mac,
        isPublic: item.isPublic,
        port: item.port
      }))

    } catch (err) {
      console.error(err);
      showMessage('error', 'Server error')
    }
  }

  return {
    getServerDetails,
    serverList
  }
}