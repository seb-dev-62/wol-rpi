<script setup lang="ts">
import { useRouter } from '#vue-router'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { onMounted } from 'vue'
import { PasswordVisibility } from '~/composables/forms/PasswordVisibility'
import { messageToast } from '~/composables/messages/message'

const { showMessage } = messageToast()
const { showPwd, showRPwd, togglePassword } = PasswordVisibility()

useHead({
  title: 'Setup'
})

const router = useRouter()

// Verify user data

const userData = z.object({
  username: z.string().min(1,'Please enter a username.'),

  email: z.string().email('Please enter valid email.').optional(),

  password: z.string()
             .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
             .regex(/[a-z]/, 'Must contain at least one lowercase letter')
             .regex(/[0-9]/, 'Must contain at least one number')
             .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character')
             .min(10, 'Must be at least 10 characters'),
  
  rPassword: z.string()
              .min(10, 'Must be at least 10 characters'),
    
  firstAdmin: z.boolean(),
  role: z.string()
})

type UserSchema = z.output<typeof userData>

const state = reactive<Partial<UserSchema>>({
  username: '',
  email: '',
  password: '',
  rPassword: '',
  firstAdmin: true,
  role: 'admin'
})

async function createAdmin(e: FormSubmitEvent<UserSchema>){
  try{
    // Verify if passwords are the same before sending to the backend
    if(state.password !== state.rPassword){
      showMessage('error', 'Passwords should match!')
      return
    }

    const res = await $fetch<{ success: boolean }>('/api/auth/create', {
      method: 'POST',
      body: {
        username: state.username,
        email: state.email,
        password: state.password,
        firstAdmin: state.firstAdmin,
        role: state.role
      }
    })

    if(res.success){
      showMessage('success', 'Admin created')
      return navigateTo('/login')
    } else {
      showMessage('error', "An error occured while creating the user.")
    }

  } catch ( err ) {
    showMessage('error', 'Server error')
    console.log(err);
  }
}
</script>

<template>
  <UContainer>
    <UCard class="mt-24 max-w-full w-[390px] mx-auto" variant="soft">
      <template #header>
        <h1 class="font-bold text-2xl">Create first user</h1>
      </template>

      <div>
        <UForm :schema="userData" :state="state" @submit="createAdmin">
          <UFormField label="Username" name="username" required>
            <UInput v-model="state.username" class="w-full" required />
          </UFormField>

          <UFormField label="E-mail address" name="email" class="mt-2">
            <UInput v-model="state.email" class="w-full" />
          </UFormField>

          <UFormField label="Password" name="password" class="mt-2" required>
            <UFieldGroup class="w-full">
              <UInput
                v-model="state.password"
                id="password"
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

          <UButton
            label="Create"
            class="mt-2 w-full text-center"
            type="submit"
          />
        </UForm>
      </div>

      <template #footer>
        Author <ULink to="https://github.com/sebastien62400" target="_blank">Sebastien Dufour</ULink>
      </template>
    
    </UCard>
  </UContainer>

  <UToast label="Error message" variant="outline" />
</template>