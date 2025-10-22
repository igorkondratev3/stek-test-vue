import { type ShallowRef, useTemplateRef } from 'vue'

export const useDialog = (selector: string = '.empty') => {
  const dialog: Readonly<ShallowRef<HTMLDialogElement | null>> = useTemplateRef(selector)
  const openDialog = () => dialog.value?.showModal()
  const closeDialog = () => dialog.value?.close()

  return {
    openDialog,
    closeDialog
  }
}
