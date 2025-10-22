<script setup>
import { computed, ref, unref, useTemplateRef } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { SortParam, List, Organization } from '@/models/index.js'

//СДЕЛАТЬ:
//модалка на удаление
//наведение красоты
//типизация 
//компоненты
//баттон для кнопки удаления
//таблица пуста
//debounce на ввод фио
//таблица одного размера
//enum - desc,asc
//надпись о пустой таблице
//протестировать с пустым хранилищем

const createOrganizationModal = useTemplateRef('create-organization-modal')
const openCreateOrganizationModal = el => {
  if (el?.id) {
    currentOrganization.value = new Organization(el.getForAPI())
  }
  createOrganizationModal.value.showModal()
}
const closeCreateOrganizationModal = () => {
  resetCurrentOrganization()
  createOrganizationModal.value.close()
}

const organizationListName = 'organizationList' //enum

//комозпбл со сторой - инициализация начального значения
const initOrganizationList = () => {
  const organizationList = JSON.parse(localStorage.getItem(organizationListName))
  if (!organizationList) {
    localStorage.setItem(organizationListName, JSON.stringify([]))
  }
}

initOrganizationList()

const organizationList = ref(new List(Organization, JSON.parse(localStorage.getItem(organizationListName))))

const createOrganization = currentOrganization => {
  organizationList.value.add({ ...unref(currentOrganization).getForAPI(), ...{ id: uuidv4() } })
  localStorage.setItem(organizationListName, JSON.stringify(organizationList.value.getForAPI()))
  closeCreateOrganizationModal()
  return
}

const updateOrganization = currentOrganization => {
  organizationList.value.update(unref(currentOrganization).getForAPI())
  localStorage.setItem(organizationListName, JSON.stringify(organizationList.value.getForAPI()))
  closeCreateOrganizationModal()
  return
}

const currentOrganization = ref(new Organization())
const resetCurrentOrganization = () => (currentOrganization.value = new Organization())

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

const validateField = (field, validationParams) => {
  for (const validationParam in validationParams) {
    switch (validationParam) {
      case 'required':
        return Boolean(field)
      default:
        return true
    }
  }
}

const validateObject = (obj, objValidationParams) => {
  for (const key in objValidationParams) {
    if (obj?.[key] && typeof obj[key] === 'object') {
      return validateObject(obj[key], objValidationParams[key])
    } else {
      if (!validateField(obj[key], objValidationParams[key])) {
        return false
      }
    }
  }
  return true
}

const isOrganizationValid = computed(() => validateObject(currentOrganization.value, organizationValidationParams))

const directorNameFilter = ref('')

const filteredOrganizationList = computed(() =>
  organizationList.value.list.filter(organization => organization.directorName.includes(directorNameFilter.value))
)

const sortedParams = ref({
  name: new SortParam(),
  directorName: new SortParam()
})

const initSort = fieldName => {
  for (const key in sortedParams.value) {
    if (key !== fieldName) {
      sortedParams.value[key].reset()
    }
  }
  sortedParams.value[fieldName].changeSortParam()
}

const sortedOrganizationList = computed(() => {
  for (const key in sortedParams.value) {
    if (sortedParams.value[key].sortParam) {
      return filteredOrganizationList.value.toSorted((a, b) => sortedParams.value[key].compare(a[key], b[key]))
    }
  }

  return filteredOrganizationList.value
})

const elementsInPage = 10
const numberOfPages = computed(() => Math.ceil(sortedOrganizationList.value.length / elementsInPage))
const pageNumber = ref(1)
const currentPageContent = computed(() =>
  sortedOrganizationList.value.slice((pageNumber.value - 1) * 10, (pageNumber.value - 1) * 10 + 10)
)
const setPageNumber = newPageNumber => (pageNumber.value = newPageNumber)

const removeOrganization = id => {
  organizationList.value.remove(id)
}
</script>

<template>
  <div class="page start-page">
    <header class="start-page__header">Справочник организаций</header>
    <main class="start-page__main">
      <input
        type="text"
        placeholder="Найти по ФИО..."
        v-model="directorNameFilter"
      />

      <button
        class="base-button"
        @click="openCreateOrganizationModal"
      >
        Добавить
      </button>

      <table>
        <thead>
          <tr>
            <th @click="initSort('name')">
              Название
              <img
                v-show="sortedParams.name.sortParam"
                src="/src/assets/images/arrow_down.svg"
                alt="delete"
                class="icon-24"
                :class="{ rotate_180deg: sortedParams.name.sortParam === 'DESC' }"
                title="удалить"
              />
            </th>
            <th @click="initSort('directorName')">
              ФИО директора
              <img
                v-show="sortedParams.directorName.sortParam"
                src="/src/assets/images/arrow_down.svg"
                alt="delete"
                class="icon-24"
                :class="{ rotate_180deg: sortedParams.directorName.sortParam === 'DESC' }"
                title="удалить"
              />
            </th>
            <th>Номер телефона</th>
            <th>Адрес</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="organization in currentPageContent"
            :key="organization.id"
            @click="openCreateOrganizationModal(organization)"
            class="cursor-pointer"
          >
            <td>{{ organization.name }}</td>
            <td>{{ organization.directorName }}</td>
            <td>{{ organization.telephoneNumber }}</td>
            <td>{{ organization.address.fullAddress }}</td>
            <td @click.stop="removeOrganization(organization.id)">
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

      <button
        class="base-button"
        :class="{ 'active-button': n === pageNumber }"
        v-for="n in numberOfPages"
        :key="n + 'pageNumber'"
        @click="setPageNumber(n)"
      >
        {{ n }}
      </button>

      <dialog
        class="dialog"
        ref="create-organization-modal"
      >
        <div class="dialog-content-wrapper">
          <div class="organization-dialog">
            <label
              >Название
              <input
                type="text"
                v-model="currentOrganization.name"
            /></label>
            <label
              >ФИО директора
              <input
                type="text"
                v-model="currentOrganization.directorName"
            /></label>
            <label
              >Номер телефона
              <input
                type="tel"
                v-model="currentOrganization.telephoneNumber"
            /></label>
            <h4>Адрес</h4>
            <label
              >Город
              <input
                type="text"
                v-model="currentOrganization.address.city"
            /></label>
            <label
              >Улица
              <input
                type="text"
                v-model="currentOrganization.address.street"
            /></label>
            <label
              >Дом
              <input
                type="text"
                v-model="currentOrganization.address.house"
            /></label>
            {{ currentOrganization }}
            <button
              class="base-button"
              :disabled="!isOrganizationValid"
              @click="
                () =>
                  currentOrganization.id
                    ? updateOrganization(currentOrganization)
                    : createOrganization(currentOrganization)
              "
            >
              Ок
            </button>
          </div>
        </div>
      </dialog>
    </main>
  </div>
</template>

<style>
.start-page {
  padding-bottom: calc(var(--base) * 0.9);
}

.start-page__header {
  font-size: calc(var(--base) * 0.48);
  font-weight: 700;
  margin-bottom: calc(var(--base) * 0.32);
  text-align: center;
}

.start-page__main {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
}

.dialog {
  border: none;
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

.organization-dialog {
  display: flex;
  flex-direction: column;
  max-height: 95vh;
  max-width: 95vw;
  padding: calc(var(--base) * 0.16);
  padding-top: 0px;
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
</style>
