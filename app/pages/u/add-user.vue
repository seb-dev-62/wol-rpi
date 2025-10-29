<script setup lang="ts">
import { messageToast } from '~/composables/messages/message'
import * as z from 'zod'
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { onMounted } from 'vue'

const { showMessage } = messageToast()
const { csrfToken } = await $fetch('/api/secure/csrf')

definePageMeta({
  layout: 'app-dashboard'
})
useHead({
  title: 'Add user'
})

const userData = z.object({
  username: z.string('You should write something.')
             .min(1, "Please, enter the username.")
             .max(16, "The username has to much character."),
  expires: z.date().optional(),
  role: z.enum(['admin', 'user'])
})

type userDataType = z.output<typeof userData>

const state = reactive<Partial<userDataType>>({
  username: undefined,
  expires: undefined,
  role: 'user'
})

// Function to send the username to the addCode.ts script to create the invite code
// for this user.
async function createCode(){
  try{
    const res = await $fetch<{ success: boolean, message: string }>('/api/auth/addCode', {
      method: 'POST',
      body: { username: state.username, expires: state.expires, role: state.role, csrfToken }
    })

    if(res.success){
      showMessage('success', res.message)

      await getCodes()
      state.username = undefined,
      state.expires = undefined
    } else {
      showMessage('error', res.message)
    }
  } catch(err) {
    console.error(err)
  }
}

interface Code {
  idusercode: number,
  username: string,
  isActivated: boolean,
  code: string,
  role: string,
  expiresAt?: string | null
}

interface getResponse {
  success: boolean,
  message: string,
  codes: Code[]
}

const codeData = ref<CodeType[]>([])
const isLoading = ref(false)

// Function to get the list of codes
async function getCodes(){
  isLoading.value = true
  try{
    const res = await $fetch<getResponse>('/api/auth/getCode', {
      method: 'GET'
    })

    if(res.success){
      codeData.value = res.codes.map(code => ({
        id: code.idusercode,
        username: code.username,
        status: code.isActivated ? 'Active' : 'Inactive' as 'Active' | 'Inactive',
        code: code.code,
        expires: code.expiresAt
                 ? new Date(code.expiresAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                 }) : 'Never'
      }))
    }
  } catch(err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  getCodes()
})

async function deleteCode(idcode: number){
  try{
    const res = await $fetch<{ success: boolean, message: string }>('/api/auth/delCode', {
      method: 'POST',
      body: { idcode, csrfToken }
    })

    if(res.success){
      showMessage('success', res.message)
      await getCodes()
    } else {
      showMessage('error', res.message)
    }
  } catch (err) {
    console.error(err)
  }
}

// Table data
const badge = resolveComponent('UBadge')
const form = resolveComponent('UForm')
const button = resolveComponent('UButton')

type CodeType = {
  id: number,
  username: string,
  status: 'Active' | 'Inactive',
  code: string,
  expires?: string | null
}

const codeCols: TableColumn<CodeType>[] = [
  {
    accessorKey: 'id',
    header: '#ID',
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => row.getValue('username')
  },
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => row.getValue('code')
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const color = {
        Active: 'success' as const,
        Inactive: 'error' as const
      }[row.getValue('status') as string]

      return h(badge, { variant: 'subtle', color }, () =>
        row.getValue('status')
      )
    }
  },
  {
    accessorKey: 'expires',
    header: 'Expires',
    cell: ({ row }) => row.getValue('expires')
  },
  {
    accessorKey: 'delete',
    header: 'Delete',
    cell: ({ row }) => {
      return h(form,
        {
          onSubmit: (e: Event) => {
            e.preventDefault()
            deleteCode(row.getValue('id'))
          }
        },
        () => [
          h(button, { type: 'submit', variant: 'subtle', color: 'error', icon: 'i-lucide-trash', label: 'Delete' })
        ]
      )
    }
  }
]
</script>

<template>
  <div class="flex gap-4">
    <h1 class="font-bold text-2xl">Add user</h1>

    <UModal title="Add new user">
      <UButton
        label="Add user"
      />

      <template #body>
        <UForm
          :state="state"
          :schema="userData"
          @submit="createCode()"
        >
          <UFormField label="Username" name="username" required>
            <UInput v-model="state.username" required />
          </UFormField>

          <UFormField label="Role" name="role" required>
            <USelect v-model="state.role" :items="['user', 'admin']" required />
          </UFormField>

          <UFormField
            label="Expires"
            name="expires"
            class="mt-2"
            title="Empty for never"
          >
            <UInput v-model="state.expires" type="date" disabled title="Work in progress" />
          </UFormField>

          <UButton
            label="Create code"
            class="mt-2"
            type="submit"
          />
        </UForm>
      </template>
    </UModal>
  </div>

  <UEmpty 
    v-if="codeData.length === 0"
    title="No code here."
    description="Click [Add user] to see the codes, copy them & see their status."
    icon="i-lucide-pizza"
  />

  <UTable v-else :data="codeData" :columns="codeCols" class="border-1 border-(--ui-border) rounded-xl" />

</template>