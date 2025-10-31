<script setup lang="ts">
import * as z from 'zod'
import { useAuth } from '~/composables/user/user'
import { messageToast } from '~/composables/messages/message'

definePageMeta({
  layout: 'app-dashboard'
})
useHead({
  title: 'Account'
})

const { idUser } = useAuth()
const { showMessage } = messageToast()

const { csrfToken } =  await $fetch('/api/secure/csrf')


const accountSelection = [
  {
    label: 'Personnal data',
    icon: 'i-lucide-shield',
    slot: 'personnalData'
  },
  {
    label: 'Password',
    icon: 'i-lucide-lock',
    slot: 'password'
  }
]

type userData = {
  idusers: number,
  username: string,
  email: string
}

const userInfos = await $fetch<{ users: userData[] }>('/api/auth/getUsers')

// Personnal data
const personnalData = z.object ({
  username: z.string().optional(),
  email: z.email('It doesn\'t look like an email.').optional()
})

type personnalSchema = z.output<typeof personnalData>

const personnalState = reactive<Partial<personnalSchema>>({
  username: undefined,
  email: undefined
})

for(let i=0; i<userInfos.users.length; i++){
  if(userInfos.users[i]?.idusers === idUser.value){
    personnalState.username = userInfos.users[i]?.username
    personnalState.email = userInfos.users[i]?.email
  }
}



// Passwords
const passwordData = z.object ({
  password: z.string('You should have a password')
             .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
             .regex(/[a-z]/, 'Must contain at least one lowercase letter')
             .regex(/[0-9]/, 'Must contain at least one number')
             .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character')
             .min(10, 'Must be at least 10 characters'),
  rPassword: z.string('Repeat your password to continu.')
              .min(10, 'Must be at least 10 characters')
})

type passwordSchema = z.output<typeof passwordData>

const passwordState = reactive<Partial<passwordSchema>>({
  password: undefined,
  rPassword: undefined
})

async function changePassword(){
  if(passwordState.password !== passwordState.rPassword){
    showMessage('error', 'The two passwords must match.')
    return
  }

  try{
    const res = await $fetch<{ success: boolean, message: string }>('/api/auth/editProfil', {
      method: 'POST',
      body: {
        password: passwordState.password,
        type: 'pass',
        csrfToken,
        idUser: idUser.value
      }
    })

    if(res.success){
      showMessage('success', res.message)
      passwordState.password = ''
      passwordState.rPassword = ''
      return
    } else {
      showMessage('error', res.message)
    }
  } catch(err) {
    console.error(err)
    showMessage('error', "Can't update your password.")
  }
}

const oldUsername = personnalState.username
const oldEmail = personnalState.email

async function changePersonnalData(){
  if(personnalState.username === oldUsername && personnalState.email === oldEmail){
    return showMessage('error', 'You must change data to update them.')
  }

  try{
    const res = await $fetch<{ success: boolean, message: string }>('/api/auth/editProfil', {
      method: 'POST',
      body: {
        username: personnalState.username,
        email: personnalState.email,
        type: 'personnalData',
        csrfToken,
        idUser: idUser.value
      }
    })
    
    if(res.success){
      return showMessage('success', res.message)
    } else {
      return showMessage('error', res.message)
    }
  } catch(err) {
    console.error(err)
    showMessage('error', "Can't update your data.")
  }
}
</script>

<template>
  <h1 class="font-bold text-2xl">User account</h1>

  <UCard variant="soft" class="w-128 max-w-[95%] mx-auto lg:mx-0">
    <UTabs :items="accountSelection">
    
      <template #personnalData>
        <UForm
          class="space-y-2"
          :schema="personnalData"
          :state="personnalState"
          @submit="changePersonnalData"
        >
          <div>
            <h2 class="text-xl">Personnal data</h2>
            <p class="text-slate-500">Change some personal infos.</p>
          </div>

          <UFormField label="Username" name="username">
            <UInput type="text" class="w-full" v-model="personnalState.username" />
          </UFormField>

          <UFormField label="Email" name="email">
            <UInput type="email" class="w-full" v-model="personnalState.email" />
          </UFormField>

          <UButton type="submit" label="Update" variant="subtle" />
        </UForm>
      </template>

      <template #password>
        <UForm
          class="space-y-2"
          :schema="passwordData"
          :state="passwordState"
          @submit="changePassword"
        >
          <div>
            <h2 class="text-xl">Password</h2>
            <p class="text-slate-500">Change your password.</p>
          </div>
          
        
          <UFormField label="Password" name="password">
            <UInput type="password" class="w-full" v-model="passwordState.password" />
          </UFormField>

          <UFormField label="Repeat your password" name="rPassword">
            <UInput type="password" class="w-full" v-model="passwordState.rPassword" />
          </UFormField>

          <UButton type="submit" label="Update" variant="subtle" />
        </UForm>
      </template>

    </UTabs>
  </UCard>
</template>