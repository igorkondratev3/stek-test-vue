import type { IAddress } from '@/types'

export class Address implements IAddress {
  public city: string | null
  public street: string | null
  public house: string | null

  constructor(address: string | null = null) {
    this.city = address?.split(',')[0]?.trim() || null
    this.street = address?.split(',')[1]?.trim() || null
    this.house = address?.split(',')[2]?.trim() || null
  }

  get fullAddress() {
    return `${this.city}, ${this.street}, ${this.house}`
  }

  getForAPI() {
    return this.fullAddress
  }
}
