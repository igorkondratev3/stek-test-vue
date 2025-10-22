import { SortParam } from '@/models'
import { computed, type Ref, ref } from 'vue'

const initSort = (params, fieldName) => {
  for (const key in params.value) {
    if (key !== fieldName) {
      params.value[key].reset()
    }
  }
  params.value[fieldName].changeSortParam()
}

export const useSorting = (arr: Ref<Object>, sortedFieldNameList: string[]) => {
  const sortedParams = ref(sortedFieldNameList.reduce((acc, fieldName) => { acc[fieldName] = new SortParam(); return acc}, {}))

  const changeSortParam = (fieldName:string) => {
    initSort(sortedParams, fieldName)
  }

  const sortedArr = computed(() => {
    for (const key in sortedParams.value) {
      if (sortedParams.value[key].sortParam) {
        return arr.value.toSorted((a, b) => sortedParams.value[key].compare(a[key], b[key]))
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
