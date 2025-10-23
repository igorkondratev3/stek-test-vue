export interface IModelObject {
  id: string
  [key: string]: null | string | object

  getForAPI(): object[]
}

export interface IModelClass {
  new (obj: object): IModelObject
}

export interface IList {
  Class: IModelClass
  list: IModelObject[]

  add(item: IModelObject): void
  update(item: IModelObject): void
  remove(id: string): void
  getForAPI(): object[]
}
