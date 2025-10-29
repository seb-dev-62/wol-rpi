import { H3Event } from 'h3'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (e: H3Event) => {
  const prisma = new PrismaClient()
  const body = await readBody(e)
  const { username, password } = body
  const { csrfToken } = await $fetch('/api/secure/csrf')
  const sessionID = getCookie(e, 'session_id') || 'guest'

  if(!csrf_verif(sessionID, csrfToken)){
    throw createError({ statusCode: 403, message: 'Invalid CSRF token' })
  }

  const user = await prisma.users.findUnique({ where: { username } })
  if(!user){
    throw createError({ statusCode: 401, statusMessage: 'Username not found.' })
  }

  const validPwd = await bcrypt.compare(password, user.password)
  if(!validPwd) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid password.' })
  }

  const token = jwt.sign(
    { idUser: user.idusers, username: user.username, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  )

  setCookie(e, 'auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24
  })

  return { success: true, user: { username: user.username, role: user.role } }
})