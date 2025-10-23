export interface IAddressData {
  city: string | null
  street: string | null
  house: string | null
}

export interface IAddress extends IAddressData {
  fullAddress: string

  getForAPI(): IAddressData
}

export type IAddressForApi = IAddressData
