export default defineEventHandler(async (e) => {
  deleteCookie(e, 'auth')
  return {success: true}
})