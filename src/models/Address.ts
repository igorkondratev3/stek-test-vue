import type { IAddress, IAddressData } from '@/types'

export class Address implements IAddress {
  public city: string | null
  public street: string | null
  public house: string | null

  constructor(address: IAddressData | null) {
    this.city = address?.city || null
    this.street = address?.street || null
    this.house = address?.house || null
  }

  get fullAddress() {
    return `${this.city}, ${this.street}, ${this.house}`
  }

  getForAPI() {
    return {
      city: this.city,
      street: this.street,
      house: this.house
    }
  }
}
