import { defineNuxtRouteMiddleware, navigateTo } from '#app'

export default defineNuxtRouteMiddleware(async (to) => {

  const publicLinks = ['/login', '/create-admin', '/register']
  const isPublicPage = publicLinks.includes(to.path)

  try {
    const empty = await $fetch<{ userEmpty: boolean }>('/api/verifs/empty')
    const { auth } = await $fetch<{ auth: boolean }>('/api/auth/user')

    if(empty.userEmpty && to.path !== '/create-admin'){
      console.log(empty.userEmpty);
      
      return navigateTo('/create-admin')
    }

    if(!empty.userEmpty){
      if(auth && to.path === '/login'){
        return navigateTo('/')
      }
    
      if (!auth && !isPublicPage) {
        return navigateTo('/login')
      }
    }
  } catch (error) {
    console.log('Error:', error)
    return navigateTo('/login')
  }
})