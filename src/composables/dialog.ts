import { onMounted, type ShallowRef, useTemplateRef } from 'vue'

export const useDialog = (selector: string = 'empty') => {
  const dialog: Readonly<ShallowRef<HTMLDialogElement | null>> = useTemplateRef(selector)
  const openDialog = () => dialog.value?.dialog.showModal()
  const closeDialog = () => dialog.value?.dialog.close()

  return {
    openDialog,
    closeDialog
  }
}
