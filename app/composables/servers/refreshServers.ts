import { useServerDetails } from "./getServerDetails"

export const useRefreshServers = () => {
  var last_update = useState('last_update', () => '')
  const { getServerDetails } = useServerDetails()

  const checkServerUpdate = async () => {
    const res = await $fetch<{ lastUpdate: string }>('/api/servers/refreshList')

    if(!last_update.value){
      await getServerDetails()
      last_update.value = res.lastUpdate
      return
    }
    if(res.lastUpdate !== last_update.value){
      await getServerDetails()
      last_update.value = res.lastUpdate
    }
  }

  return {
    checkServerUpdate
  }
}