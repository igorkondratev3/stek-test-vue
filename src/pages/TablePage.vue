<script setup lang="ts">
import { computed, ref, unref, useTemplateRef } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { SortParam, List, Organization } from '@/models/index.js'
import { useDialog, useLocalstorage, usePagination, useSorting } from '@/composables/index.js'
import { useValidator } from '@/composables/validator.js'
import type { IOrganization } from '@/types/index.js'

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
const { isValid: isCurrentOrganizationValid } = useValidator(currentOrganization, organizationValidationParams)

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

const {
  sortedParams,
  changeSortParam,
  sortedArr: sortedOrganizationList
} = useSorting(filteredOrganizationList, sortedFieldNameList)

const { numberOfPages, pageNumber, changePageNumber, currentPageContent } = usePagination(sortedOrganizationList)

const { openDialog: openOrganizationDialog, closeDialog: closeOrganizationDialog } =
  useDialog('create-organization-dialog')

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

const organizationDialogHeader = computed(() =>
  currentOrganization.value.id ? 'Редактировать организацию' : 'Добавить организацию'
)

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

        <table class="organization-table">
          <thead>
            <tr>
              <th
                @click="changeSortParam('name')"
                class="column organization-table__column_col_20"
              >
                Название
                <img
                  v-show="sortedParams.name.sortParam"
                  src="/src/assets/images/arrow_down.svg"
                  alt="arrow"
                  class="icon-24"
                  :class="{ rotate_180deg: sortedParams.name.sortParam === 'DESC' }"
                  title="удалить"
                />
              </th>
              <th
                @click="changeSortParam('directorName')"
                class="column organization-table__column_col_20"
              >
                ФИО директора
                <img
                  v-show="sortedParams.directorName.sortParam"
                  src="/src/assets/images/arrow_down.svg"
                  alt="arrow"
                  class="icon-24"
                  :class="{ rotate_180deg: sortedParams.directorName.sortParam === 'DESC' }"
                  title="удалить"
                />
              </th>
              <th class="column organization-table__column_col_20">Номер телефона</th>
              <th class="column organization-table__column_col_30">Адрес</th>
              <th class="column organization-table__column_col_10"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="organization in currentPageContent"
              :key="organization.id"
              @click="initOpenOrganizationDialog(organization)"
              class="cursor-pointer"
            >
              <td>{{ organization.name }}</td>
              <td>{{ organization.directorName }}</td>
              <td>{{ organization.telephoneNumber }}</td>
              <td>{{ organization.address.fullAddress }}</td>
              <td @click.stop="organizationList.remove(organization.id)">
                <img
                  src="/src/assets/images/delete.svg"
                  alt="delete"
                  class="icon-24"
                  title="удалить"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pagination">
          <button
            class="base-button pagination-button"
            :class="{ 'active-button': n === pageNumber }"
            v-for="n in numberOfPages"
            :key="n + 'pageNumber'"
            @click="changePageNumber(n)"
          >
            {{ n }}
          </button>
        </div>
      </div>

      <dialog
        class="dialog"
        ref="create-organization-dialog"
      >
        <div class="dialog-content-wrapper">
          <div class="dialog-content">
            <h3 class="dialog-content__header">{{ organizationDialogHeader }}</h3>

            <div class="dialog-content__info">
              <label
                >Название
                <input
                  type="text"
                  class="base-input"
                  v-model="currentOrganization.name"
                />
              </label>
              <label
                >ФИО директора
                <input
                  type="text"
                  class="base-input"
                  v-model="currentOrganization.directorName"
              /></label>
              <label
                >Номер телефона
                <input
                  type="tel"
                  class="base-input"
                  v-model="currentOrganization.telephoneNumber"
              /></label>
              <h4>Адрес</h4>
              <label
                >Город
                <input
                  type="text"
                  class="base-input"
                  v-model="currentOrganization.address.city"
              /></label>
              <label
                >Улица
                <input
                  type="text"
                  class="base-input"
                  v-model="currentOrganization.address.street"
              /></label>
              <label
                >Дом
                <input
                  type="text"
                  class="base-input"
                  v-model="currentOrganization.address.house"
              /></label>
            </div>

            <div class="dialog-content_actions">
              <button
                class="base-button"
                :disabled="!isCurrentOrganizationValid"
                @click="saveOrganization(currentOrganization)"
              >
                Ок
              </button>
              <button
                class="base-button"
                @click="initCloseOrganizationDialog"
              >
                Отменить
              </button>
            </div>
          </div>
        </div>
      </dialog>
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

.dialog-content-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.664);
  backdrop-filter: blur(calc(var(--base) * 0.1));
  overflow: auto;

  ::-webkit-scrollbar {
    display: none;
  }

  ::-webkit-scrollbar-track {
    display: none;
  }

  ::-webkit-scrollbar-thumb {
    display: none;
  }

  scrollbar-width: none;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  max-height: 95vh;
  max-width: 95vw;
  padding: calc(var(--base) * 0.16) calc(var(--base) * 0.24) calc(var(--base) * 0.16) calc(var(--base) * 0.24);
  border-radius: calc(var(--base) * 0.16);
  margin-left: calc(var(--base) * 0.04);
  margin-right: calc(var(--base) * 0.04);
  margin-bottom: calc(var(--base) * 0.04);
  overflow: scroll;
  background-color: rgb(177, 205, 223);

  &::-webkit-scrollbar {
    display: none;
  }

  &::-webkit-scrollbar-track {
    display: none;
  }

  &::-webkit-scrollbar-thumb {
    display: none;
  }

  scrollbar-width: none;
}

.dialog-content__header {
  align-self: center;
}

.dialog-content__info {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: calc(var(--base) * 0.16);
}

.dialog-content_actions {
  display: flex;
  justify-content: right;
  gap: calc(var(--base) * 0.08);
  margin-top: calc(var(--base) * 0.16);
}

table {
  border: 2px solid rgb(140 140 140);
}

th,
td {
  border: 1px solid rgb(160 160 160);
}

.cursor-pointer {
  cursor: pointer;
}

.table-settings {
  display: flex;
  justify-content: space-between;
}

.organization-table {
  width: 100%;
  margin-top: calc(var(--base) * 0.08);
}

.organization-table__column_col_20 {
  width: 20%;
}

.organization-table__column_col_30 {
  width: 38%;
}

.organization-table__column_col_10 {
  width: 2%;
}

.table-wrapper {
  width: 90%;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: calc(var(--base) * 0.16);
  margin-top: calc(var(--base) * 0.08);
}
</style>
