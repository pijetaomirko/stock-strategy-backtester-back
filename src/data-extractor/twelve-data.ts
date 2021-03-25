import { VerticalSlice } from "../stock/vertical-slice"
import IExtractor from "./extractor-i"
import { StockData } from "../stock/stock-data"

const https = require("https")

export class TwelveDataExtractor implements IExtractor {
  async getStockData(withPointers: boolean): Promise<StockData[]> {
    console.log("TwelveDataExtractor.getStockData.... started")
    return new Promise(async (resolve) => {
      const symbols: string[] = await this.fetchStockSymbols()
      console.log(symbols)
      const stocks: StockData[] = await this.fetchVerticalSliceData([
        "AACG",
        "AACQ",
        "AAL",
        "AAME",
        "AAOI",
        "AAON",
        "AAPL",
        "AAWW"
      ])
      console.log("TwelveDataExtractor.getStockData.... ended")
      resolve(stocks)
    })
  }

  async fetchStockSymbols(): Promise<string[]> {
    return new Promise(async (resolve) => {
      console.log("fetching basic stock data from server.... started")
      const url = `https://api.twelvedata.com/stocks?exchange=NASDAQ`
      await https
        .get(url, (res: any) => {
          let json: string = ""
          res.on("data", (chunk: any) => {
            json += chunk
          })

          res.on("end", () => {
            const jsonObj: { data: [{ symbol: string }] } = JSON.parse(json)
            const result: string[] = jsonObj.data.map((item: { symbol: string }) => item.symbol)
            const resultOnlyUnique: string[] = Array.from(new Set(result))
            console.log(resultOnlyUnique)
            console.log("fetching basic stock data from server.... ended")
            resolve(resultOnlyUnique)
          })
        })
        .on("error", (err: any) => {
          console.log("Error: " + err.message)
        })
    })
  }

  async fetchVerticalSliceData(stockSymbols: string[]): Promise<StockData[]> {
    return new Promise(async (resolve) => {
      console.log("fetching data from server.... started")
      let symbolsForUrl = stockSymbols.map((symbol) => symbol + ",")
      const url = `https://api.twelvedata.com/time_series?&symbol=${symbolsForUrl}&interval=1h&apikey=d6fa58c0870e449cba8dce5299ad20fe&outputsize=3`
      await https
        .get(url, (res: any) => {
          let jsonResponse: string = ""
          res.on("data", (chunk: any) => {
            jsonResponse += chunk
          })

          res.on("end", () => {
            console.log("fetching data from server.... ended")
            const stocks: StockData[] = this.parseResponseJsonToModel(stockSymbols, jsonResponse)
            resolve(stocks)
          })
        })
        .on("error", (err: any) => {
          console.log("Error: " + err.message)
        })
    })
  }

  parseResponseJsonToModel(stockSymbols: string[], json: string): StockData[] {
    const jsonObj = JSON.parse(json)
    let stocks: StockData[] = []
    try {
      stockSymbols.forEach((symbol) => {
        console.log("Parsing stock symbol=" + symbol + "...")
        console.log(json)
        if (jsonObj[symbol].status !== "ok") {
          throw new Error(`Error thrown when parsing symbol ${symbol}`)
        }
        console.log(symbol + "\t extraction status = " + jsonObj[symbol].status)
        let stock: StockData = new StockData()
        stock.name = symbol
        jsonObj[symbol].values.forEach((jsonSlice: any) => {
          stock.append(
            new VerticalSlice(
              new Date(jsonSlice.datetime),
              jsonSlice.open,
              jsonSlice.close,
              jsonSlice.high,
              jsonSlice.low,
              jsonSlice.volume
            ),
            false
          )
        })
        stocks.push(stock)
      })
    } catch (e) {
      console.log(e)
    }
    return stocks
  }
}
