import { VerticalSlice } from "./vertical-slice"
import { Direction } from "../types/direction"

export class StockData {
  constructor() {}

  name: string = 'Stock name'
  slices: VerticalSlice[] =  []

  first(): VerticalSlice {
    return this.slices[0]
  }

  last(): VerticalSlice {
    return this.slices[this.length() - 1]
  }

  length(): number {
    return this.slices.length
  }

  append(slice: VerticalSlice, withPointers: boolean = true): VerticalSlice {
    this.slices.push(slice)
    if(this.slices.length > 1 && withPointers) {
      slice.prev = this.slices[this.length() - 2]
      slice.prev.next = this.slices[this.length() - 1]
    }
    return slice
  }

  getSliceListWithoutPointers(): StockData {
    let stockData: StockData = new StockData()
    this.first().executeEachIteration(Direction.RIGHT, null, (slice) => {
      stockData.append(new VerticalSlice(slice.date, slice.high, slice.close, slice.high, slice.low, slice.volume))
      return true
    })
    return stockData
  }
}
