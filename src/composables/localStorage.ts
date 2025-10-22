const initStorage = (name: string, initValue: any) => {
  const data = JSON.parse(localStorage.getItem(name))
  if (!data) {
    localStorage.setItem(name, JSON.stringify(initValue))
  }
}

export const useLocalstorage = (name: string, initValue: any) => {
  initStorage(name, initValue)

  const getValue = () => {
    return JSON.parse(localStorage.getItem(name))
  }

  const setValue = (value: any) => {
    localStorage.setItem(name, JSON.stringify(value))
  }

  return {
    getValue,
    setValue
  }
}
