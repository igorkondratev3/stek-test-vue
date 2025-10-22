<script setup lang="ts">
import type { IOrganizationDialogProps } from '@/types'
import { computed, useTemplateRef } from 'vue'
import { IOrganization } from '@/types'

const props = defineProps<IOrganizationDialogProps>()

defineEmits<{
  close: []
  save: []
}>()

const name = defineModel('name')
const directorName = defineModel('directorName')
const telephoneNumber = defineModel('telephoneNumber')
const city = defineModel('city')
const street = defineModel('street')
const house = defineModel('house')

const organizationDialogHeader = computed(() =>
  props.organizationId ? 'Редактировать организацию' : 'Добавить организацию'
)

const dialog = useTemplateRef('dialog')
defineExpose({ dialog })
</script>

<template>
  <dialog
    class="dialog"
    ref="dialog"
      @cancel.prevent="$emit('close')"
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
              v-model="name"
            />
          </label>
          <label
            >ФИО директора
            <input
              type="text"
              class="base-input"
              v-model="directorName"
          /></label>
          <label
            >Номер телефона
            <input
              type="tel"
              class="base-input"
              v-model="telephoneNumber"
          /></label>
          <h4>Адрес</h4>
          <label
            >Город
            <input
              type="text"
              class="base-input"
              v-model="city"
          /></label>
          <label
            >Улица
            <input
              type="text"
              class="base-input"
              v-model="street"
          /></label>
          <label
            >Дом
            <input
              type="text"
              class="base-input"
              v-model="house"
          /></label>
        </div>

        <div class="dialog-content_actions">
          <button
            class="base-button"
            :disabled="!props.isValidOrganization"
            @click="$emit('save')"
          >
            Ок
          </button>
          <button
            class="base-button"
            @click="$emit('close')"
          >
            Отменить
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>
<script setup lang="ts"></script>
