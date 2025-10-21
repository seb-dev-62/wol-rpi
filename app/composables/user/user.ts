export const useAuth = () => {
  const { data, pending, error } = useFetch('/api/auth/user')

  const user = computed(() => data.value?.user)
  const isAuth = computed(() => data.value?.auth ?? false)
  const idUser = computed(() => user.value?.idUser)
  const username = computed(() => user.value?.username)
  const role = computed(() => user.value?.role)

  const ready = computed(() => !pending.value && !error.value)

  return{
    user,
    isAuth,
    idUser,
    username,
    role,
    ready
  }
}