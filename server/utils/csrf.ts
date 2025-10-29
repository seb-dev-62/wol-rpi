import crypto from 'crypto'

const tokens = new Map<string, string>()

export function csrf_gen(sessionID: string){
  const token = crypto.randomBytes(32).toString('hex')
  tokens.set(sessionID, token)
  return token
}

export function csrf_verif(sessionID: string, token: string){
  return tokens.get(sessionID) === token
}