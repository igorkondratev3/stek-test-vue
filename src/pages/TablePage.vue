<script setup lang="ts">
import { computed, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { List, Organization } from '@/models/index.js'
import { useDialog, useLocalstorage } from '@/composables/index.js'
import { useValidator } from '@/composables/validator.js'
import type { IOrganization } from '@/types/index.js'
import OrganizationTable from '@/components/OrganizationTable.vue'
import OrganizationDialog from '@/components/OrganizationDialog.vue'

const currentOrganization = ref(new Organization())

const organizationValidationParams = {
  name: { required: true },
  directorName: { required: true },
  telephoneNumber: { required: true },
  address: {
    city: { required: true },
    street: { required: true },
    house: { required: true }
  }
}
const { isValid: isValidCurrentOrganization } = useValidator(currentOrganization, organizationValidationParams)

const { getValue: getOrganizationListFromStorage, setValue: setOrganizationListInStorage } = useLocalstorage(
  'organizationList',
  []
)

const organizationList = ref(new List(Organization, getOrganizationListFromStorage()))

const directorNameFilter = ref('')
const filteredOrganizationList = computed(() =>
  organizationList.value.list.filter((organization: IOrganization) =>
    organization.directorName.includes(directorNameFilter.value)
  )
)

const sortedFieldNameList = ['name', 'directorName']

const { openDialog: openOrganizationDialog, closeDialog: closeOrganizationDialog } = useDialog('organization-dialog')

const resetCurrentOrganization = () => (currentOrganization.value = new Organization())

const initOpenOrganizationDialog = (organization: IOrganization) => {
  if (organization?.id) {
    currentOrganization.value = new Organization(organization.getForAPI())
  }
  openOrganizationDialog()
}
const initCloseOrganizationDialog = () => {
  resetCurrentOrganization()
  closeOrganizationDialog()
}

const saveOrganization = (currentOrganization: IOrganization) => {
  currentOrganization.id
    ? organizationList.value.update(currentOrganization.getForAPI())
    : organizationList.value.add({ ...currentOrganization.getForAPI(), ...{ id: uuidv4() } })
  setOrganizationListInStorage(organizationList.value.getForAPI())
  initCloseOrganizationDialog()
}
</script>

<template>
  <div class="page table-page">
    <header class="table-page__header">Справочник организаций</header>
    <main class="table-page__main">
      <div class="table-wrapper">
        <div class="table-settings">
          <input
            type="text"
            placeholder="Найти по ФИО..."
            class="base-input"
            v-model="directorNameFilter"
          />
          <button
            class="base-button"
            @click="initOpenOrganizationDialog(currentOrganization)"
          >
            Добавить
          </button>
        </div>
        <OrganizationTable
          :sorted-field-name-list="sortedFieldNameList"
          :organization-list="filteredOrganizationList"
          @select-organization="initOpenOrganizationDialog"
          @remove-organization="id => organizationList.remove(id)"
        />
      </div>

      <OrganizationDialog
        ref="organization-dialog"
        :organization-id="currentOrganization.id"
        :is-valid-organization="isValidCurrentOrganization"
        v-model:name="currentOrganization.name"
        v-model:directorName="currentOrganization.directorName"
        v-model:telephoneNumber="currentOrganization.telephoneNumber"
        v-model:city="currentOrganization.address.city"
        v-model:street="currentOrganization.address.street"
        v-model:house="currentOrganization.address.house"
        @save="saveOrganization(currentOrganization)"
        @close="initCloseOrganizationDialog"
      />
    </main>
  </div>
</template>

<style>
.table-page {
  padding-bottom: calc(var(--base) * 0.9);
}

.table-page__header {
  font-size: calc(var(--base) * 0.48);
  font-weight: 700;
  margin-bottom: calc(var(--base) * 0.32);
  text-align: center;
}

.table-page__main {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
}

.table-settings {
  display: flex;
  justify-content: space-between;
}

.table-wrapper {
  width: 90%;
}
</style>
