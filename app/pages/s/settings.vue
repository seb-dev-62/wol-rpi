<script setup lang="ts">
definePageMeta({
  layout: 'app-dashboard'
})
useHead({
  title: 'System settings'
})



const slider = ref(3)
</script>

<template>
  <h1 class="font-bold text-2xl">System settings</h1>

  <UForm
    class="max-w-[90%] w-[300px]"
  >
    <UFormField label="System name">
      <UInput type="text" />
    </UFormField>

    <UFormField :label="'API Speed: '+ slider + ' sec'" class="mt-2">
      <USlider size="xs" v-model="slider" :min="1" :max="120" />
    </UFormField>
  </UForm>
</template>