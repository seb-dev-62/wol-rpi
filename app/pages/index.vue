<script setup lang="ts">
import * as z from 'zod'
import { useAddServers } from '~/composables/servers/addServer'
import { useServerDetails } from '~/composables/servers/getServerDetails'
import { useDeleteServers } from '~/composables/servers/deleteServer'
import { useServerData } from '~/composables/servers/serverState'
import { messageToast } from '~/composables/messages/message'
import { useRefreshServers } from '~/composables/servers/refreshServers'
import { useEditServer } from '~/composables/servers/editServer'
import { useStartServer } from '~/composables/servers/startServer'

const { serverList } = useServerDetails()
const { deleteServerState, serverState } = useServerData()
const { addServers } = useAddServers(serverState)
const { deleteServer } = useDeleteServers(deleteServerState)
const { showMessage } = messageToast()
const { checkServerUpdate } = useRefreshServers()
const { editServer } = useEditServer(serverState)
const { startServer } = useStartServer(serverState)

// Add the dashboard around the content & define page's title
definePageMeta({
  layout: 'app-dashboard'
})
useHead({
  title: 'My servers'
})

// Display server cards when page loaded
onMounted(async () => {
  await checkServerUpdate()
})

setInterval(() => checkServerUpdate(), 3000)

// Input verifications for the Add Server modal
const addServerSchema = z.object({
  id: z.number().optional(),
  name: z.string('Enter a server name.')
         .min(1, 'You server name should have at least 1 character.'),
  description: z.string().optional(),
  mac: z.string()
        .regex(
          /^([0-9A-Fa-f]{2}([-:])){5}([0-9A-Fa-f]{2})$/,
          'Invalid MAC address (use uppercase: AB:CD:EF:12:34:56)'
        )
        .min(17).max(17),
  broadcast: z.string('Enter a valid broadcast address.')
              .regex(
                /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.255$/,
                'Invalid broadcast address, ends with 255.'
              )
              .min(10).max(15),
  port: z.enum(['7', '9'], { message: 'Please select a port.' })
})

// Input verifications for the Delete Server modal
const deleteServerSchema = z.object({
  id: z.number(),
  name: z.string('Enter a server name.')
         .min(1, 'You server name should have at least 1 character.')
})

function serverDelVerification(serverName: string){
  if(serverName !== deleteServerState.value.name){
    showMessage('error', "Server's names don't match.")
    return
  } else {
    deleteServer()
  }
}

// Edit server components
const editServerSchema = z.object({
  id: z.number(),
  name: z.string('Enter a server name.')
         .min(1, 'You server name should have at least 1 character.'),
  description: z.string().optional(),
  mac: z.string()
        .regex(
          /^([0-9A-Fa-f]{2}([-:])){5}([0-9A-Fa-f]{2})$/,
          'Invalid MAC address (use uppercase: AB:CD:EF:12:34:56)'
        )
        .min(17).max(17),
  broadcast: z.string('Enter a valid broadcast address.')
              .regex(
                /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.255$/,
                'Invalid broadcast address, ends with 255.'
              )
              .min(10).max(15),
  port: z.enum(['7', '9'], { message: 'Please select a port.' })
})
</script>

<template>

  <!-- Top page -->
  <div class="flex flex-row gap-2">
    <h1 class="font-bold text-2xl">My servers</h1>

    <!-- Modal to add a server -->
    <UModal title="Add a server">
      <template #default>
        <UButton
          title="Add a server"
          icon="i-lucide-plus"
        />
      </template>

      <template #body>
        <UForm
          @submit="addServers"
          :state="serverState"
          :schema="addServerSchema"
        >

          <!-- SERVER NAME -->
          <UFormField label="Server name" name="name" required>
            <UInput v-model="serverState.name" placeholder="My Server" required />
          </UFormField>

          <!-- SERVER DESCRIPTION -->
          <UFormField label="Server description" name="description" class="mt-2">
            <UTextarea v-model="serverState.description" placeholder="A small description" />
          </UFormField>

          <USeparator class="my-4" />

          <!-- SERVER'S MAC ADDRESS -->
          <UFormField label="MAC address" name="mac" required>
            <UInput
              v-model="serverState.mac"
              placeholder="AB:CD:EF:GH:12:34:5I"
              max="17"
              required
            />
          </UFormField>

          <!-- BROADCAST WHERE IS THE SERVER -->
          <UFormField label="Broadcast" name="broadcast" class="mt-2" required>
            <UInput
              v-model="serverState.broadcast"
              placeholder="192.168.1.255"
              required />
          </UFormField>

          <!-- WOL PORT -->
          <UFormField
            label="Port"
            class="mt-2"
            name="port"
          >
            <USelect
              v-model="serverState.port"
              :items="['9', '7']"
            />
          </UFormField>

          <div class="flex flex-row justify-end w-full gap-2">
            <UButton
              label="Add"
              variant="soft"
              type="submit"
            />
          </div>
        </UForm>
      </template>
    </UModal>
  </div>

  <UPageColumns>

    <div v-if="serverList.length === 0">
      <h1>No server found.</h1>
    </div>

    <!-- Server list -->
    <UCard
      v-for="item in serverList"
    >
      <template #header>
        <div class="flex flex-row justify-between items-center">

          <!-- Server name above the card with the status in a badge -->
          <div>
            <h1 class="font-bold text-xl">{{ item.name }}</h1>
            <UBadge :color="item.status === 'Online' ? 'success' : 'error'" variant="subtle">
              {{ item.status }}
            </UBadge>
          </div>


          <!-- If server is started, you can stop it and so on -->
          <UForm
            @submit=""
          >

            <input type="hidden" v-model="serverState.mac" name="mac">
            <input type="hidden" v-model="serverState.broadcast" name="broadcast">
            <input type="hidden" v-model="serverState.port" name="port">
            <UButton
              label="Start"
              icon="i-lucide-play"
              type="submit"
              v-if="item.status === 'Offline'"/>
          </UForm>
        </div>
      </template>

      <!-- Server's description -->
      <div>
        <p v-if="item.description.length > 0">{{ item.description }}</p>
        <p v-else class="text-gray-500">No description for this server.</p>
      </div>

      <!-- Modals to edit or delete the server -->
      <template #footer>


        <!-- Edit modal -->
        <UModal :title="item.name">
          <UButton
            label="Edit"
            icon='i-lucide-edit'
            variant="soft"
            class="mr-4 cursor-pointer"
          />
          
          
          <!-- Infos of the server to edit -->
          <template #body>
            <UForm
              :schema="editServerSchema"
              :state="serverState"
              @submit="editServer"
            >

              <input
                v-model="serverState.id"
                name="id"
                type="hidden"
              />

              <!-- Server's name -->
              <UFormField
                label="Server name"
              >
                <UInput
                  v-model="serverState.name"
                  placeholder="Enter your server name."
                />
              </UFormField>

              <!-- Server's description -->
              <UFormField
                label="Server description"
                class="mt-2"
              >
                <UTextarea
                  v-model="serverState.description"
                  placeholder="Enter a small description."
                />
              </UFormField>

              <USeparator class="mt-4" />

              <!-- Server's MAC address -->
              <UFormField
                label="MAC address"
                class="mt-2"
              >
                <UInput
                  v-model="serverState.mac"
                  placeholder="i.e: AB:CD:01:04:25"
                />
              </UFormField>

              <!-- Server's broadcast -->
              <UFormField
                label="Broadcast address"
                class="mt-2"
              >
                <UInput
                  v-model="serverState.broadcast"
                  placeholder="i.e: 192.168.0.255"
                />
              </UFormField>


              <!-- Port for the WOL -->
              <UFormField
                label="Port"
                class="mt-2"
              >
                <USelect
                  v-model="serverState.port"
                  :items="[
                    '9','7'
                  ]"
                />
              </UFormField>


              <!-- Confirm the edit -->
              <div class="flex flex-row justify-end w-full gap-2">
                <UButton
                  label="Confirm"
                  variant="soft"
                  type="submit"
                />
              </div>
            </UForm>
          </template>
        </UModal>
  

        <!-- Delete modal -->
        <UModal :title="item.name">
          <UButton
            label="Delete"
            icon='i-lucide-trash'
            variant="soft"
            color="error"
            class="cursor-pointer"
            @click="() => {
              deleteServerState.id = item.id
            }"
          />
          
          <!-- Info of the server to edit -->
          <template #body>

            <!-- Ask the user the name of the server to deleate as security -->
            <p class='mb-2'>To delete the server, type <UBadge color="neutral">{{ item.name }}</UBadge>.</p>
            <UForm
              :schema="deleteServerSchema"
              :state="deleteServerState"
              @submit="serverDelVerification(item.name)"
            >

              <input type="hidden" v-model="deleteServerState.id" name="id">

              <!-- Server name -->
              <UFormField name="name">
                <UInput
                  placeholder="Type server name..."
                  v-model="deleteServerState.name"
                />
              </UFormField>

              <!-- Confirm to delete -->
              <div class="flex flex-row justify-end w-full gap-2 pt-4">
                <UButton
                  label="Delete"
                  variant="soft"
                  color="error"
                  type="submit"
                />
              </div>
            </UForm>
          </template>
        </UModal>
      </template>
    </UCard>

  </UPageColumns>
</template>