export interface IAddress {
  city: string | null
  street: string | null
  house: string | null
  fullAddress: string

  getForAPI(): string
}

export type IAddressForApi = string
