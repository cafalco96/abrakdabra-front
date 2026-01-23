<script setup lang="ts">
import SearchBar from '~/components/SearchBar.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['role-admin'], // solo administradores pueden ver esta página
})

type UserRole = 'admin' | 'gestor' | 'buyer'

type AdminUser = {
  id: number
  name: string
  email: string
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

const router = useRouter()

const {
  data: usersPage,
  pending,
  error,
} = await useAuthApiFetch<{
  data: AdminUser[]
  current_page: number
  last_page: number
}>(`/users`)

const users = computed(() => usersPage.value?.data ?? [])

const roleFilter = ref<'all' | UserRole>('all')
const searchTerm = ref('')
const roleFilterOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Administradores', value: 'admin' },
  { label: 'Gestores', value: 'gestor' },
  { label: 'Compradores', value: 'buyer' },
]

const filteredUsers = computed(() => {
  let result = users.value

  // Filtrar por rol
  if (roleFilter.value !== 'all') {
    result = result.filter((user) => user.role === roleFilter.value)
  }

  // Filtrar por nombre o correo
  const term = searchTerm.value.toLowerCase().trim()
  if (term) {
    result = result.filter((user) => 
      user.name.toLowerCase().includes(term) || 
      user.email.toLowerCase().includes(term)
    )
  }

  return result
})

// Diálogo de confirmación para eliminar usuario
const deleteDialog = ref(false)
const userToDelete = ref<number | null>(null)

const confirmDeleteUser = (userId: number) => {
  userToDelete.value = userId
  deleteDialog.value = true
}

const deleteUser = async () => {
  if (!userToDelete.value) return

  const { error: deleteError } = await useAuthApiFetch(
    `/users/${userToDelete.value}`,
    { method: 'DELETE' }
  )

  if (!deleteError.value && usersPage.value) {
    // Crear nuevo objeto para forzar reactividad
    usersPage.value = {
      ...usersPage.value,
      data: usersPage.value.data?.filter(u => u.id !== userToDelete.value) ?? []
    }
  }

  deleteDialog.value = false
  userToDelete.value = null
}
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-4">
      <h1 class="text-h5">Usuarios</h1>

      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        to="/admin/users/create"
      >
        Nuevo usuario
      </v-btn>
    </div>

    <div class="d-flex flex-column flex-md-row align-md-center gap-4 mb-4">
      <div class="flex-grow-1">
        <SearchBar
          v-model="searchTerm"
          placeholder="Buscar por nombre o correo..."
          @search="(val) => (searchTerm = val)"
        />
      </div>

      <v-select
        v-model="roleFilter"
        :items="roleFilterOptions"
        item-title="label"
        item-value="value"
        label="Filtrar por rol"
        variant="outlined"
        density="comfortable"
        hide-details
        class="flex-md-shrink-0"
        style="min-width: 280px; max-width: 280px"
      />
    </div>

    <div v-if="pending">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else-if="error">
      <v-alert type="error" variant="tonal">
        No se pudieron cargar los usuarios.
      </v-alert>
    </div>

    <v-table v-else density="comfortable">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Activo</th>
          <th class="text-right">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>{{ user.is_active ? 'Sí' : 'No' }}</td>
          <td class="text-right">
            <v-btn
              icon="mdi-pencil"
              variant="text"
              density="comfortable"
              color="primary"
              :to="`/admin/users/${user.id}/edit`"
            />
            <v-btn
              icon="mdi-delete"
              variant="text"
              density="comfortable"
              color="error"
              @click="confirmDeleteUser(user.id)"
            />
          </td>
        </tr>

        <tr v-if="!users.length">
          <td colspan="5" class="text-caption text-medium-emphasis">
            No hay usuarios.
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Diálogo de confirmación para eliminar usuario -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="elevated" @click="deleteUser">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
