import type { IAddress, IAddressForApi } from '../../types'

export interface IOrganizationData {
  id: string | null
  name: string | null
  directorName: string | null
  telephoneNumber: string | null
}

export interface IOrganizationDataForAPI extends IOrganizationData {
  address: IAddressForApi
}

export interface IOrganization extends IOrganizationData {
  address: IAddress
  getForAPI(): IOrganizationDataForAPI
}
