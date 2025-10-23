<script setup lang="ts">
import type { IOrganization, IOrganizationTableProps } from '@/types'
import { usePagination, useSorting } from '@/composables'
import { toRef } from 'vue'

const props = defineProps<IOrganizationTableProps>()

defineEmits<{
  selectOrganization: [organization: IOrganization]
  removeOrganization: [id: number]
}>()

const {
  sortedParams,
  changeSortParam,
  sortedArr: sortedOrganizationList
} = useSorting(toRef(props, 'organizationList'), props.sortedFieldNameList)

const { numberOfPages, pageNumber, changePageNumber, currentPageContent } = usePagination(sortedOrganizationList)
</script>

<template>
  <table class="organization-table">
    <thead>
      <tr>
        <th
          @click="changeSortParam('name')"
          class="column organization-table__column_col_20"
        >
          <div class="organization-table__column_sorted">
            Название
            <img
              v-show="sortedParams.name?.sortParam"
              src="/src/assets/images/arrow_down.svg"
              alt="arrow"
              class="icon-16"
              :class="{ rotate_180deg: sortedParams.name?.sortParam === 'DESC' }"
            />
          </div>
        </th>
        <th
          class="column organization-table__column_col_20"
          @click="changeSortParam('directorName')"
        >
          <div class="organization-table__column_sorted">
            ФИО директора
            <img
              v-show="sortedParams.directorName?.sortParam"
              src="/src/assets/images/arrow_down.svg"
              alt="arrow"
              class="icon-16"
              :class="{ rotate_180deg: sortedParams.directorName?.sortParam === 'DESC' }"
            />
          </div>
        </th>
        <th class="column organization-table__column_col_20">Номер телефона</th>
        <th class="column organization-table__column_col_30">Адрес</th>
        <th class="column organization-table__column_col_10"></th>
      </tr>
    </thead>
    <tbody>
      <tr
        class="cursor-pointer"
        v-for="(organization, index) in currentPageContent"
        :key="organization.id || index + 'organization'"
        @click="$emit('selectOrganization', organization)"
      >
        <td>{{ organization.name }}</td>
        <td>{{ organization.directorName }}</td>
        <td>{{ organization.telephoneNumber }}</td>
        <td>{{ organization.address.fullAddress }}</td>
        <td
          class="cursor-default"
          @click.stop=""
        >
          <button
            class="cursor-pointer"
            @click.stop="$emit('removeOrganization', organization.id)"
          >
            <img
              src="/src/assets/images/delete.svg"
              alt="delete"
              class="icon-16"
              title="удалить"
            />
          </button>
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
</template>

<style>
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

.organization-table__column_sorted {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  gap: calc(var(--base) * 0.08);
}

.pagination {
  display: flex;
  gap: calc(var(--base) * 0.16);
  width: 100%;
  margin-top: calc(var(--base) * 0.08);
  overflow: auto;
}
</style>
