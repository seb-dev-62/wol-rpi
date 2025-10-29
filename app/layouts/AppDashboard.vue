<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { NavigationMenuItem } from '@nuxt/ui'
import { useAuth } from '~/composables/user/user'
import { useRouter } from 'vue-router'
import { until } from '@vueuse/core'
import { computed, onMounted } from 'vue'

const { username, role, isAuth, ready } = useAuth()
const router = useRouter()

onMounted(async () => {
  await until(isAuth).toBe(true)
})

// Disconnect the user
async function handleLogout() {
  try {
    const res = await $fetch<{ success: boolean }>('/api/auth/logout')

    if(res.success){
      router.push('/login')
    } else {
    }
  } catch (err){
    console.error(err);
  }
}

// Content in the User menu
const userMenu = computed<DropdownMenuItem[][]>(() => {
  
  const allItems: DropdownMenuItem[][] = [
    [
      {
        label: 'Account',
        icon: 'i-lucide-user',
        to: '/u/account'
      }
    ],
    [
      {
        label: 'Admin',
        icon: 'i-lucide-shield-user',
        requiredRole: 'admin' as const,
        children: [
          {
            label: 'Add user',
            icon: 'i-lucide-user-plus',
            to: '/u/add-user'
          },
          {
            label: 'System',
            icon: 'i-lucide-monitor-cog',
            to: '/s/settings',
          },
          {
            label: 'Manage user',
            icon: 'i-lucide-user-cog',
            to: '/u/manage-user'
          }
        ]
      }
    ],
    [
      {
        label: 'Equipements',
        icon: 'i-lucide-cable',
        children: [
          {
            label: 'Servers',
            icon: 'i-lucide-server',
            to: '/'
          }
        ]
      }
    ],
    [
      {
        label: 'Log out',
        icon: 'i-lucide-log-out',
        onSelect(){
        handleLogout()
        }
      }
    ]
  ]

  return allItems.map(group => group.filter(item =>
    !('requiredRole' in item) || item.requiredRole === role.value
  )).filter(group => group.length > 0)
})



// Content in the side bar. Not collapsed.
const sideItems: NavigationMenuItem[][] = [[{
  label: 'Servers',
  icon: 'i-lucide-server',
  to: '/'
}], [{
  label: 'GitHub',
  icon: 'i-lucide-github',
  to: 'https://github.com/seb-dev-62',
  target: '_blank'
}]]



// Name of the system
const SystemName = "Nebula"
const CollapsedSystemName = Array.from(SystemName)[0]
</script>

<template>
  <UDashboardGroup v-if="ready">

    
    <!-- Side bar -->
    <UDashboardSidebar resizable collapsible mode="drawer">



      <!-- Side's bar header -->
      <template #header="{ collapsed }">
        <h1 v-if="!collapsed" class="font-bold text-2xl text-center w-full truncate">{{ SystemName }}</h1>
        <h1 v-else class="font-bold text-2xl text-center w-full">{{ CollapsedSystemName }}</h1>
      </template>



      <!-- Side bar content -->
      <template #default="collapsed">

        <!-- Top content -->
        <UNavigationMenu
          :items="sideItems[0]"
          orientation="vertical"/>


        <!-- Bottom content -->
         <UNavigationMenu
          :items="sideItems[1]"
          orientation="vertical"
          class="mt-auto"/>
      </template>
    </UDashboardSidebar>

    <UDashboardPanel>


      <!-- Dashboard HEADER -->
      <template #header>
        <UDashboardNavbar title="Dashboard">

          <!-- Make the sidebar resizable -->
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>

          <!-- Right side header -->
          <template #right>

            <UColorModeButton />

            <!-- User data & navigation -->
            <UDropdownMenu :items="userMenu">
              <UUser
                :name="username || 'Refresh'"
                :description="role || 'to display'"
                :avatar="{icon: 'i-lucide-user'}"/>
            </UDropdownMenu>
          </template>

        </UDashboardNavbar>
      </template>

      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>

  <div v-else>
    <h1>Loading</h1>
  </div>
</template>