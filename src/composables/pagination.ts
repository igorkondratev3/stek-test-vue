import { computed, ref, type Ref, watch } from 'vue'

export const usePagination = (arr: Ref<Object>, elementsInPage: number = 10, ) => {
  const pageNumber = ref(1)
  const numberOfPages = computed(() => Math.ceil(arr.value.length / elementsInPage))
  const changePageNumber = (newPageNumber: number) => pageNumber.value = newPageNumber
  const currentPageContent = computed(() =>
    arr.value.slice((pageNumber.value - 1) * 10, (pageNumber.value - 1) * 10 + 10)
  )

  watch(() => arr.value.length, () => {
    if (pageNumber.value > numberOfPages.value) {
      pageNumber.value = numberOfPages.value || 1
    }
  })

  return {
    numberOfPages,
    pageNumber,
    changePageNumber,
    currentPageContent
  }
}
