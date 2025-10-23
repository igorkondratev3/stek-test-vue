import { SortParam } from '@/models'
import { computed, type ComputedRef, type Ref, ref } from 'vue'
import type { ISortParam } from '@/types'

const initSort = (params: Ref<{ [key: string]: ISortParam }>, fieldName: string) => {
  for (const key in params.value) {
    if (key !== fieldName) {
      params.value[key]?.reset()
    }
  }
  params.value[fieldName]?.changeSortParam()
}

export const useSorting = <T>(arr: Ref<T[]>, sortedFieldNameList: string[]) => {
  const sortedParams: Ref<{ [key: string]: ISortParam }> = ref(
    sortedFieldNameList.reduce((acc: { [key: string]: any }, fieldName) => {
      acc[fieldName] = new SortParam()
      return acc
    }, {})
  )

  const changeSortParam = (fieldName: string) => {
    initSort(sortedParams, fieldName)
  }

  const sortedArr: ComputedRef<T[]> = computed(() => {
    for (const key in sortedParams.value) {
      if (sortedParams.value[key]?.sortParam) {
        return arr.value.toSorted((a: string, b: string) => sortedParams.value[key]?.compare(a[key], b[key]))
      }
    }

    return arr.value
  })

  return {
    sortedParams,
    changeSortParam,
    sortedArr
  }
}
