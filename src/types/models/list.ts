export interface IModelObjectData {
  id: string | null
  [key: string]: null | string | object
}

export interface IModelObject extends IModelObjectData {
  getForAPI(): object[]
}

export interface IModelClass {
  new (obj: IModelObjectData): IModelObject
}

export interface IList {
  Class: IModelClass
  list: IModelObject[]

  add(item: IModelObject): void

  update(item: IModelObject): void

  remove(id: string): void

  getForAPI(): object[]
}
