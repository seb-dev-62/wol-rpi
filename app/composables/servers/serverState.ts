import { useAuth } from '~/composables/user/user'

export interface fullServerDetails {
  id: number,
  name: string,
  description: string,
  status: string,
  mac: string,
  broadcast: string,
  port: '7' | '9',
  isPublic: boolean,
}

export interface editableServer {
  id: number,
  name: string,
  description: string,
  mac: string,
  broadcast: string,
  port: '7' | '9',
  isPublic: boolean,
  idCreator: number
}

export interface deleteServer {
  id: number,
  name: string
}

export const useServerData = () => {
  const { idUser } = useAuth()

  const serverList = useState<fullServerDetails[]>('serverList', () => [])

  const serverState = useState<editableServer>('serverState', () => ({
    id: 0,
    name: '',
    description: '',
    mac: '',
    broadcast: '',
    port: '9',
    isPublic: true,
    idCreator: idUser.value
  }))

  const deleteServerState = useState<deleteServer>('deleteServerState', () => ({
    id: 0,
    name: ''
  }))

  return { serverList, serverState, deleteServerState }
}