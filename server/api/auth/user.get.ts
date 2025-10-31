import jwt from "jsonwebtoken"

export default defineEventHandler(async (e) => {
  const token = getCookie(e, 'auth')
  
  const referer = getHeader(e, 'referer')
  if(!referer || !referer.startsWith('http://')){
    throw createError({ statusCode: 403, statusMessage: 'Invalid origin' })
  }

  if(!token){
    return { auth: false }
  }

  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET!)
    return { auth: true, user: payload }
  } catch {
    return { auth: false }
  }
})