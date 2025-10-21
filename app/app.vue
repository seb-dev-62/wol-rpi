<script setup lang="ts">
import {useRouter} from '#vue-router'
import { onMounted } from 'vue';

const router = useRouter()

interface emptyUser {
  userEmpty: boolean
}

// onMounted(async () => {
//   const data = await $fetch<emptyUser>('/api/verifs/empty')

//   if(data.userEmpty){
//     router.push('/setup')
//   }
// })
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
