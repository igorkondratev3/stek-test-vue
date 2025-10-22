export interface IModelObject {
  id: string
  [key: string]: null | string
}

export interface IModelClass {
  new (): IModelObject
}

export interface IList {
  Class: IModelClass
  list: IModelObject[]

  add(item: IModelObject): void
  update(item: IModelObject): void
  remove(id: number): void
  geForAPI(): [IModelObject]
}
