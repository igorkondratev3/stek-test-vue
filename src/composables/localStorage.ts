const initStorage = (name: string, initValue: any) => {
  const data = localStorage.getItem(name)
  const parsedData = data ? JSON.parse(data) : null
  if (!parsedData) {
    localStorage.setItem(name, JSON.stringify(initValue))
  }
}

export const useLocalstorage = (name: string, initValue: any) => {
  initStorage(name, initValue)

  const getValue = () => {
    const data = localStorage.getItem(name)
    const parsedData = data ? JSON.parse(data) : null
    return parsedData
  }

  const setValue = (value: any) => {
    localStorage.setItem(name, JSON.stringify(value))
  }

  return {
    getValue,
    setValue
  }
}
