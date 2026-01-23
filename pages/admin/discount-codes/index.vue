<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['role-admin-gestor'],
})

import { useAuthApiFetch } from '~/composables/useAuthApiFetch'

type DiscountCode = {
  id: number
  code: string
  type: 'percentage' | 'fixed'
  value: string
  is_active: boolean
  starts_at: string | null
  ends_at: string | null
  max_uses: number | null
  used_count: number
  created_at: string
}

const codes = ref<DiscountCode[]>([])
const loading = ref(false)
const dialog = ref(false)
const editingId = ref<number | null>(null)

const deleteDialog = ref(false)
const deletingItem = ref<DiscountCode | null>(null)

const form = ref({
  code: '',
  type: 'percentage',
  value: 10,
  is_active: true,
  starts_at: null as string | null,
  ends_at: null as string | null,
  max_uses: null as number | null,
})

const formErrors = ref<Record<string, string[]>>({})
const isSubmitting = ref(false)

const pad = (n: number) => n.toString().padStart(2, '0')

const formatDateForInput = (value: string | null) => {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  // Mostrar en hora local para que el usuario vea la hora que seleccionó originalmente
  const yyyy = d.getFullYear()
  const mm = pad(d.getMonth() + 1)
  const dd = pad(d.getDate())
  const hh = pad(d.getHours())
  const mi = pad(d.getMinutes())
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
}

const toIsoString = (value: string | null) => {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  // Convertir datetime-local (interpretado en zona local) a ISO UTC
  return d.toISOString()
}

const fetchCodes = async () => {
  loading.value = true
  try {
    const { data } = await useAuthApiFetch<{ data: DiscountCode[] }>('/admin/discount-codes')
    codes.value = data.value?.data ?? []
  } finally {
    loading.value = false
  }
}

onMounted(fetchCodes)

const resetForm = () => {
  form.value = {
    code: '',
    type: 'percentage',
    value: 10,
    is_active: true,
    starts_at: null,
    ends_at: null,
    max_uses: null,
  }
  formErrors.value = {}
}

const openCreateDialog = () => {
  resetForm()
  editingId.value = null
  dialog.value = true
}

const openEditDialog = (item: DiscountCode) => {
  form.value = {
    code: item.code,
    type: item.type,
    value: Number(item.value),
    is_active: item.is_active,
    starts_at: formatDateForInput(item.starts_at),
    ends_at: formatDateForInput(item.ends_at),
    max_uses: item.max_uses,
  }
  formErrors.value = {}
  editingId.value = item.id
  dialog.value = true
}

const handleSave = async () => {
  isSubmitting.value = true
  formErrors.value = {}

  const isEdit = !!editingId.value
  const url = isEdit
    ? `/admin/discount-codes/${editingId.value}`
    : '/admin/discount-codes'
  const method = isEdit ? 'PUT' : 'POST'

  try {
    const { data, error } = await useAuthApiFetch<DiscountCode>(url, {
      method,
      body: {
        ...form.value,
        starts_at: toIsoString(form.value.starts_at),
        ends_at: toIsoString(form.value.ends_at),
      },
    })

    if (error.value) {
      const err = error.value as any
      if (err.status === 422 && err.data?.errors) {
        formErrors.value = err.data.errors
      }
      return
    }

    if (data.value) {
      if (isEdit) {
        const idx = codes.value.findIndex(c => c.id === data.value!.id)
        if (idx !== -1) codes.value[idx] = data.value
      } else {
        codes.value.unshift(data.value)
      }
      dialog.value = false
    }
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = (item: DiscountCode) => {
  deletingItem.value = item
  deleteDialog.value = true
}

const isDeleting = ref(false)

const handleDelete = async () => {
  if (!deletingItem.value) return

  isDeleting.value = true
  try {
    const { error } = await useAuthApiFetch(`/admin/discount-codes/${deletingItem.value.id}`, {
      method: 'DELETE',
    })

    if (!error.value) {
      codes.value = codes.value.filter(c => c.id !== deletingItem.value!.id)
      deleteDialog.value = false
      deletingItem.value = null
    }
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-4">
      <h1 class="text-h5">Códigos de descuento</h1>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="openCreateDialog"
      >
        Nuevo cupón
      </v-btn>
    </div>

    <v-card>
      <v-data-table
        :items="codes"
        :loading="loading"
        :headers="[
          { title: 'Código', value: 'code' },
          { title: 'Tipo', value: 'type' },
          { title: 'Valor', value: 'value' },
          { title: 'Activo', value: 'is_active' },
          { title: 'Usos', value: 'used_count' },
          { title: 'Acciones', value: 'actions', sortable: false },
        ]"
      >
        <template #item.code="{ item }">
          <span class="text-uppercase">{{ item.code }}</span>
        </template>
        <template #item.type="{ item }">
          <span>{{ item.type === 'percentage' ? 'Porcentaje' : 'Fijo' }}</span>
        </template>
        <template #item.value="{ item }">
          <span v-if="item.type === 'percentage'">{{ item.value }}%</span>
          <span v-else>${{ item.value }}</span>
        </template>
        <template #item.is_active="{ item }">
          <v-chip
            :color="item.is_active ? 'success' : 'grey'"
            size="small"
            label
          >
            {{ item.is_active ? 'Activo' : 'Inactivo' }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            @click="openEditDialog(item)"
          />
          <v-btn
            icon="mdi-delete"
            size="small"
            variant="text"
            color="error"
            @click="confirmDelete(item)"
          />
        </template>
        <template #no-data>
          <div class="text-center py-6">
            <p class="text-body-2 text-medium-emphasis mb-0">
              No hay códigos de descuento disponibles.
            </p>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>{{ editingId ? 'Editar código de descuento' : 'Nuevo código de descuento' }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleSave">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.code"
                  label="Código"
                  placeholder="ABRA10"
                  :readonly="!!editingId"
                  :error-messages="formErrors.code"
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="form.type"
                  :items="[
                    { title: 'Porcentaje', value: 'percentage' },
                    { title: 'Monto fijo', value: 'fixed' },
                  ]"
                  label="Tipo"
                  :error-messages="formErrors.type"
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.value"
                  label="Valor"
                  type="number"
                  min="0.01"
                  :suffix="form.type === 'percentage' ? '%' : 'USD'"
                  :error-messages="formErrors.value"
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-switch
                  v-model="form.is_active"
                  label="Activo"
                  color="primary"
                  inset
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.starts_at"
                  label="Válido desde"
                  type="datetime-local"
                  :error-messages="formErrors.starts_at"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.ends_at"
                  label="Válido hasta"
                  type="datetime-local"
                  :error-messages="formErrors.ends_at"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.max_uses"
                  label="Máximo de usos"
                  type="number"
                  min="1"
                  :error-messages="formErrors.max_uses"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            :loading="isSubmitting"
            @click="handleSave"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Eliminar código</v-card-title>
        <v-card-text>
          ¿Seguro que deseas eliminar el código
          <strong class="text-uppercase">{{ deletingItem?.code }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            :loading="isDeleting"
            @click="handleDelete"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
