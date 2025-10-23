export type SortType = 'ASC' | 'DESC'

export type SortTypeArr = SortType[]

export type CompareResult = -1 | 1

export type CompareFunction = (a: string, b: string) => CompareResult

export interface CompareFunctionObject {
  [key: string]: CompareFunction
}

export interface ISortParam {
  sortParam: SortType | null

  compare(a: string, b: string): CompareResult | null
  changeSortParam(): void
  reset(): void
}
