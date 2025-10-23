import type { ISortParam, CompareResult, CompareFunctionObject, SortTypeArr, SortType } from '@/types/models'

export class SortParam implements ISortParam {
  public sortParam: SortType | null

  constructor() {
    this.sortParam = null
  }

  static sortQueue: SortTypeArr = ['ASC', 'DESC']

  static compareFunctions: CompareFunctionObject = {
    ASC: (a: string, b: string): CompareResult => (a > b ? 1 : -1),
    DESC: (a: string, b: string): CompareResult => (a > b ? -1 : 1)
  }

  compare(a: string, b: string): CompareResult | null {
    return this.sortParam ? SortParam.compareFunctions[this.sortParam]?.(a, b) || null : null
  }

  changeSortParam() {
    if (!this.sortParam) {
      this.sortParam = SortParam.sortQueue[0] || null
      return
    }

    if (SortParam.sortQueue.at(-1) === this.sortParam) {
      this.sortParam = null
      return
    }

    this.sortParam = SortParam.sortQueue[SortParam.sortQueue.indexOf(this.sortParam) + 1] || null
  }

  reset() {
    this.sortParam = null
  }
}
