import { Address } from './Address.ts'
import type { IOrganization, IAddress, IOrganizationDataForAPI } from '../types'

export class Organization implements IOrganization {
  public id: string | null
  public name: string | null
  public directorName: string | null
  public telephoneNumber: string | null
  public address: IAddress

  constructor(organization: IOrganizationDataForAPI | null = null) {
    this.id = organization?.id || null
    this.name = organization?.name || null
    this.directorName = organization?.directorName || null
    this.telephoneNumber = organization?.telephoneNumber || null
    this.address = new Address(organization?.address || null)
  }

  getForAPI() {
    return {
      id: this.id,
      name: this.name,
      directorName: this.directorName,
      telephoneNumber: this.telephoneNumber,
      address: this.address.getForAPI()
    }
  }
}
