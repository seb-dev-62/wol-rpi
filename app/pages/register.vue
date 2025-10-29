<script setup lang="ts">
import { useRouter } from '#vue-router'
import { PasswordVisibility } from '~/composables/forms/PasswordVisibility'
import { messageToast } from '~/composables/messages/message'
import { z } from "zod"
import type { FormSubmitEvent } from '@nuxt/ui'

const { csrfToken } = await $fetch('/api/secure/csrf')

const { showPwd, showRPwd, togglePassword } = PasswordVisibility()
const { showMessage } = messageToast()

const router = useRouter()

useHead({
  title: 'Register'
})

const userData = z.object({
  username: z.string().min(1,'Please enter a username.'),

  email: z.email('Invalid email format.').optional(),

  password: z.string()
             .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
             .regex(/[a-z]/, 'Must contain at least one lowercase letter')
             .regex(/[0-9]/, 'Must contain at least one number')
             .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character')
             .min(10, 'Write your password to connect.'),
  
  rPassword: z.string()
              .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
              .regex(/[a-z]/, 'Must contain at least one lowercase letter')
              .regex(/[0-9]/, 'Must contain at least one number')
              .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character')
              .min(10, 'You must repeat your password.'),
  
  code: z.string('Enter your invite code to register.')
         .min(11, 'Your code is too short')
         .max(11, 'Your code is too long')
         .regex(/^wol-\d{7}$/, 'Invalid format')
})

type UserSchema = z.output<typeof userData>

const state = reactive<Partial<UserSchema>>({
  username: '',
  password: '',
  rPassword: '',
  code: '',
  email: undefined
})

async function regData(e: FormSubmitEvent<UserSchema>){
  if(state.password === state.rPassword){
    try{
      const res = await $fetch<{ success: boolean, message: string }>('/api/auth/register', {
        method: 'POST',
        body: {
          username: state.username,
          password: state.password,
          code: state.code,
          email: state.email,
          csrfToken
        }
      })

      if(res.success){
        router.push('/login')
      } else {
        showMessage('error', res.message)
      }
    } catch (err) {
      console.log(err);
      showMessage('error', 'Server error')
    }
  } else {
    showMessage('error', 'Your passwords are differents')
  }
}
</script>

<template>
  <UContainer>
    <UCard class="mt-12 max-w-full w-[390px] mx-auto" variant="soft">
      <template #header>
        <h1 class="font-bold text-2xl">Register</h1>
      </template>

      <div>
        <UForm :schema="userData" :state="state" @submit="regData">
          <UFormField label="Username" name="username" required>
            <UInput class="w-full" v-model="state.username" required />
          </UFormField>

          <UFormField label="Email" name="email" class="mt-2">
            <UInput class="w-full" v-model="state.email" />
          </UFormField>

          <UFormField label="Password" name="password" class="mt-2" required>
            <UFieldGroup class="w-full">
              <UInput
                v-model="state.password"
                id="Password"
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

          <UFormField label="Repeat password" name="rPassword" class="mt-2" required>
            <UFieldGroup class="w-full">
              <UInput
                v-model="state.rPassword"
                id="rPassword"
                class="w-full"
                :type="showRPwd ? 'text' : 'password'"
                required
              />
              <UButton
                variant="outline"
                color="neutral"
                :icon="showRPwd ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                @click="togglePassword('repeat')"
              />
            </UFieldGroup>
          </UFormField>

          <UFormField label="Invite code" class="mt-2" name="code" required>
            <UInput class="w-full" v-model="state.code" required />
          </UFormField>

          <UButton
            label="Register"
            class="mt-2 w-full text-center"
            type="submit"
          />

          <p class="mt-4">Already owns an account? Why not <ULink to="/login">log in?</ULink></p>
        </UForm>
      </div>

      <template #footer>
        Author <ULink to="https://github.com/seb-dev-62" target="_blank">Sebastien Dufour</ULink>
      </template>
    
    </UCard>
  </UContainer>
</template>