<script setup lang="ts">
import { useRouter } from '#vue-router'
import { PasswordVisibility } from '~/composables/forms/PasswordVisibility'
import { messageToast } from '~/composables/messages/message'
import { z } from "zod"
import type { FormSubmitEvent } from '@nuxt/ui'

const { showPwd, togglePassword } = PasswordVisibility()
const { showMessage } = messageToast()

const router = useRouter()

useHead({
  title: 'Login'
})

const userData = z.object({
  username: z.string().min(1,'Please enter a username.'),

  password: z.string()
             .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
             .regex(/[a-z]/, 'Must contain at least one lowercase letter')
             .regex(/[0-9]/, 'Must contain at least one number')
             .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character')
             .min(10, 'Write your password to connect.'),
})

type UserSchema = z.output<typeof userData>

const state = reactive<Partial<UserSchema>>({
  username: '',
  password: ''
})

async function logData(e: FormSubmitEvent<UserSchema>){
  try{
    const res = await $fetch<{ success: boolean, message: string }>('/api/auth/login', {
      method: 'POST',
      body: {
        username: state.username,
        password: state.password
      }
    })

    if(res.success){
      console.log('Logged in!');
      router.push('/')
    } else {
      showMessage('error', res.message)
    }
  } catch (err) {
    console.log(err);
    showMessage('error', 'Server error')
  }

  console.log(e);
}
</script>


<template>
  <UContainer>
    <UCard class="mt-12 max-w-full w-[390px] mx-auto" variant="soft">
      <template #header>
        <h1 class="font-bold text-2xl">Login</h1>
      </template>

      <div>
        <UForm :schema="userData" :state="state" @submit="logData">
          <UFormField label="Username">
            <UInput class="w-full" v-model="state.username" name="username" required />
          </UFormField>

          <UFormField label="Password" class="mt-2">
            <UFieldGroup class="w-full">
              <UInput
                v-model="state.password"
                id="rPassword"
                class="w-full"
                :type="showPwd ? 'text' : 'password'"
                required
              />
              <UButton
                variant="outline"
                color="neutral"
                :icon="showPwd ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                @click="togglePassword('main')"
              />
            </UFieldGroup>
          </UFormField>

          <UButton
            label="Login"
            class="mt-2 w-full text-center"
            type="submit"
          />

          <p class="mt-4">Don't have account ? Let's <ULink to="/register">create one!</ULink></p>
        </UForm>
      </div>

      <template #footer>
        Author <ULink to="https://github.com/seb-dev-62" target="_blank">Sebastien Dufour</ULink>
      </template>
    
    </UCard>
  </UContainer>
</template>