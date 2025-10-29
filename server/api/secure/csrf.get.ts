import { csrf_gen } from "#imports"

export default defineEventHandler(async (e) => {
  const sessionID = getCookie(e, 'session_id') || 'guest'
  const token = csrf_gen(sessionID)

  return { csrfToken: token }
})