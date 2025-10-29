<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { messageToast } from '~/composables/messages/message'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

const { showMessage } = messageToast()

definePageMeta({
  layout: 'app-dashboard'
})
useHead({
  title: 'Manage users'
})

type users = {
  idusers: string,
  username: string,
  creation_date: string,
  role: string,
  firstAdmin: boolean,
  email?: string
}

interface getResponse {
  success: boolean,
  message: string,
  users: users[]
}

const data = ref<users[]>([])

async function getUsers(){
  try{
    const res = await $fetch<getResponse>('/api/auth/getUsers', {
      method: 'GET'
    })

    if(res.success){
      data.value = res.users.map(user => ({
        idusers: user.idusers,
        username: user.username,
        creation_date: user.creation_date,
        email: user.email,
        role: user.role,
        firstAdmin: user.firstAdmin
      }))
    }
  } catch(err) {
    console.error(err)
  }
}

onMounted(() => {
  getUsers()
})

const cols: TableColumn<users>[] = [
  {
    accessorKey: 'idusers',
    header: '#ID',
    cell: ({ row }) => `#${row.getValue('idusers')}`
  },
  {
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => `${row.getValue('username')}`
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => `${row.getValue('email')}`
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const color = {
        admin: 'warning' as const,
        user: 'neutral' as const
      }[row.getValue('role') as string]

      return h(UBadge, { variant: 'subtle', color }, () => 
        row.getValue('role')
      )
    }
  },
  {
    accessorKey: 'creation_date',
    header: 'Created on',
    cell: ({ row }) => {
      return new Date(row.getValue('creation_date')).toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  },
  {
    accessorKey: 'firstAdmin',
    header: '',
    cell: () => null
  },
  {
    accessorKey: 'delete',
    header: 'Delete user',
    cell: ({ row }) => {
      return h(UButton, {
                          label: 'Delete',
                          variant: 'subtle',
                          icon: 'i-lucide-trash',
                          color: 'error',
                          disabled: row.getValue('firstAdmin'),
                          title: row.getValue('firstAdmin') ? "User can't be deleted!" : ''
                        })
    }
  },
]
</script>

<template>
  <h1 class="font-bold text-2xl">Manage users</h1>

  <UEmpty
    v-if="data.length === 0"
    title="No user registered."
    description="How can you see this btw ?"
  />

  <UTable
    v-else
    :data="data"
    :columns="cols"
    class="border-1 border-(--ui-border) rounded-2xl"
  />
</template>