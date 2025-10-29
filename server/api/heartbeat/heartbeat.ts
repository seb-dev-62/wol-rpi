import { messageToast } from "../../../app/composables/messages/message"
import * as fs from 'fs'
import path from "path"

export const useHeartbeat = () => {
  const { showMessage } = messageToast()

  const HeartbeatMaker = async (serverID: number, ) => {
  const heartPath = path.resolve(`./heartbeat/heartbeat-${serverID}.sh`)

  const heartbeatFile = "#!/bin/bash\n"+
                        `SERVER_ID=${serverID}\n`+
                        `API_URL="http://192.168.1.115/api/server/heartbeat"\n`+
                        `DATA=1\n`+
                        `while true; do\n`+
                        ` curl -s -X POST "$API_URL" -H "Content-Type: application/json" -d { \\"request\\": \\"$DATA\\", \\"id\\": \\"$SERVER_ID\\" }\n`+
                        ` sleep(3)\n`+
                        `done`

    try{
      if(!fs.existsSync(heartPath)){
        fs.writeFileSync(heartPath, heartbeatFile, 'utf-8')
        showMessage('success', `Your can download your heartbeat-${serverID}.sh.`)
      } else {
        showMessage('error', `Error while creating heartbeat-${serverID}.sh`)
      }
    } catch(err){
      console.error(err)
    }
  }

  return { HeartbeatMaker }
}