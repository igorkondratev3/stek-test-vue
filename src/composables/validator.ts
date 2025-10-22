import { computed, type Ref } from 'vue'

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

export const useValidator = (obj: Ref<Object>, params: Object) => {
  const isValid = computed(() => validateObject(obj.value, params))

  return {
    isValid
  }
}
