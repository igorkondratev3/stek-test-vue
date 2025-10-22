import type { IList, IModelClass, IModelObject } from '@/types/models'

export class List implements IList {
  public Class: IModelClass
  public list: IModelObject[]

  constructor(classObj: IModelClass, list: IModelObject[]) {
    this.Class = classObj
    this.list = list ? list.map(el => new this.Class(el)) : []
  }

  add(item: IModelObject) {
    this.list.push(new this.Class(item))
  }

  update(item: IModelObject) {
    const index = this.list.findIndex(el => el.id === item.id)
    this.list.splice(index, 1, new this.Class(item))
  }

  remove(id: number) {
    const index = this.list.findIndex(el => el.id === id)
    this.list.splice(index, 1)
  }

  getForAPI() {
    return this.list.map(el => el.getForAPI())
  }
}
