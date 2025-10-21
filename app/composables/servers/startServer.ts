import type { editableServer } from "./serverState";

export const useStartServer = (serverState: Ref<editableServer>) => {

  const startServer = async () => {
    try{

    } catch(err){
      console.error(err)
    }
  }

  return { startServer }
}