<script setup lang="ts">
definePageMeta({
  layout: 'app-dashboard'
})
useHead({
  title: 'Account'
})
</script>

<template>
  <h1 class="font-bold text-2xl">User account</h1>

  <UForm
    class="max-w-[90%] w-[300px] space-y-2"

  >
    <div>
      <h2 class="text-xl">Personnal data</h2>
      <p class="text-slate-500">Change some personal infos.</p>
    </div>

    <UFormField label="Username" name="username">
      <UInput type="text" />
    </UFormField>

    <UFormField label="Email" name="email">
      <UInput type="email" />
    </UFormField>

    <UButton type="submit" label="Update" variant="subtle" />
  </UForm>

  <UForm
    class="max-w-[90%] w-[300px] space-y-2 mt-2"

  >
    <div>
      <h2 class="text-xl">Password</h2>
      <p class="text-slate-500">Change your password.</p>
    </div>
    
  
    <UFormField label="Password" name="password">
      <UInput type="password" />
    </UFormField>

    <UFormField label="Repeat your password" name="rPassword">
      <UInput type="password" />
    </UFormField>

    <UButton type="submit" label="Update" variant="subtle" />
  </UForm>
</template>